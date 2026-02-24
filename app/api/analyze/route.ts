import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend'; // <-- NUEVO: Importamos Resend

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// <-- NUEVO: Inicializamos Resend
const resend = new Resend(process.env.RESEND_API_KEY); 

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    // MODIFICADO: Ahora también pedimos el 'email' de la base de datos
    const { data: diagnostic, error: fetchError } = await supabaseAdmin
      .from('diagnostics')
      .select('answers, email') 
      .eq('id', id)
      .single();

    if (fetchError || !diagnostic) {
      console.error("Error obteniendo respuestas:", fetchError);
      return NextResponse.json({ error: 'Diagnóstico no encontrado' }, { status: 404 });
    }

    const answers = diagnostic.answers;
    const userEmail = diagnostic.email; // Guardamos el email para usarlo luego

    const systemPrompt = `
      Eres un agente de diagnóstico comercial senior de El Solar Creative Group.
      Tu trabajo es analizar las respuestas de un sistema B2B y generar un reporte json de diagnóstico.

      SISTEMA DE CALIFICACIÓN:
      - P1 (Antigüedad): <2 años (0), 2-5 años (1), 5-15 años (2), >15 años (3)
      - P2 (Tamaño): 1-2 (0), 3-10 (1), 10-30 (2), >30 (3)
      
      CRITERIOS DE CUELLOS DE BOTELLA:
      - CRÍTICO: Dependencia canales pasivos
      - CRÍTICO: Alto esfuerzo sin sistema
      - MODERADO: Proceso dependiente de individuos
      - MODERADO: Oferta mal articulada
      - LATENTE: Sin datos comerciales
      - LATENTE: Baja inversión en adquisición
      
      Identifica entre 2 y 3 problemas exactos.
      ADICIONALMENTE: Identifica exactamente 2 "Oportunidades de optimización" que el usuario está desaprovechando.

      FÓRMULA DE SCORE:
      Score = 100 - (críticos * 25) - (moderados * 15) - (latentes * 8). Mínimo 20, Máximo 80.

      REGLAS ESTRICTAS DE SALIDA:
      Devuelve ÚNICAMENTE un JSON válido con esta estructura:
      {
        "score": 42,
        "titulo": "Encontramos X problemas que están frenando tu crecimiento",
        "subtitulo_score": "Tu sistema opera en modo reactivo",
        "resumen_ejecutivo": "Tu sistema funciona, pero opera en modo reactivo...",
        "perfil_empresa": "Empresa B2B, >5 años de operación, equipo de 10-30 personas.",
        "puntaje_calificacion": 4,
        "problemas": [
          {
            "numero": "01",
            "etiqueta": "CRÍTICO",
            "titulo": "Tu canal principal no escala sin ti",
            "descripcion": "El voz a voz es eficiente...",
            "senal": "Señal detectada: mayoría de clientes llegan por referidos."
          }
        ],
        "oportunidades": [
          {
            "titulo": "Automatización del seguimiento inicial",
            "descripcion": "Estás perdiendo tiempo valioso al depender de..."
          }
        ],
        "cta_texto": "Para recibir tu plan de acción completo, agenda...",
        "nota_etapa_temprana": false
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analiza estas respuestas y genera el JSON: ${JSON.stringify(answers)}` }
      ],
      response_format: { type: "json_object" }
    });

    const aiResponseText = completion.choices[0].message.content || '{}';
    const reportData = JSON.parse(aiResponseText);

    const { error: updateError } = await supabaseAdmin
      .from('diagnostics')
      .update({ 
        ai_report: reportData, 
        score: reportData.score,
        status: 'completed' 
      })
      .eq('id', id);

    if (updateError) {
      console.error("Error guardando el reporte generado:", updateError);
      return NextResponse.json({ error: 'Error al actualizar DB' }, { status: 500 });
    }

    // <-- NUEVO: Bloque de envío de correo
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const reportUrl = `${siteUrl}/report/${id}`;

      await resend.emails.send({
        from: 'El Solar Creative Group <operaciones@elsolaragencia.co>', // REEMPLAZA ESTO CON TU CORREO VERIFICADO EN RESEND
        to: userEmail,
        subject: 'Tu diagnóstico de adquisición B2B está listo',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Hola, tu diagnóstico ha finalizado.</h2>
            <p style="color: #334155; font-size: 16px; line-height: 1.5;">
              Hemos analizado tus respuestas y detectado los cuellos de botella exactos en tu sistema de adquisición B2B.
            </p>
            <div style="margin: 30px 0;">
              <a href="${reportUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Ver mi reporte completo
              </a>
            </div>
            <p style="color: #64748b; font-size: 14px;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
              <a href="${reportUrl}" style="color: #2563eb;">${reportUrl}</a>
            </p>
          </div>
        `
      });
      console.log("Correo enviado con éxito a:", userEmail);
    } catch (emailError) {
      console.error("Error enviando el correo (pero el reporte sí se generó):", emailError);
    }

    // Notificación interna al equipo de El Solar
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const reportUrl = `${siteUrl}/report/${id}`;
      await resend.emails.send({
        from: 'El Solar Creative Group <operaciones@elsolaragencia.co>',
        to: 'operaciones@elsolaragencia.co',
        subject: `🎯 Nuevo lead B2B: ${userEmail} — Score ${reportData.score}/100`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0f172a; margin-bottom: 4px;">Nuevo lead completó su diagnóstico</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 0;">Solar Creative Group · Diagnóstico de Adquisición B2B</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px 12px; background: #f8fafc; border-radius: 6px 6px 0 0; color: #64748b; font-size: 13px;">Email</td>
                <td style="padding: 10px 12px; background: #f8fafc; border-radius: 6px 6px 0 0; font-weight: bold;">${userEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; background: #f1f5f9; color: #64748b; font-size: 13px;">Score</td>
                <td style="padding: 10px 12px; background: #f1f5f9; font-weight: bold; color: ${reportData.score >= 65 ? '#16a34a' : reportData.score >= 50 ? '#ea580c' : '#dc2626'};">${reportData.score} / 100</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; background: #f8fafc; border-radius: 0 0 6px 6px; color: #64748b; font-size: 13px;">Perfil</td>
                <td style="padding: 10px 12px; background: #f8fafc; border-radius: 0 0 6px 6px;">${reportData.perfil_empresa}</td>
              </tr>
            </table>
            <div style="padding: 16px; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 0 6px 6px 0; margin-bottom: 24px;">
              <p style="color: #1e40af; font-size: 14px; margin: 0; line-height: 1.5;">${reportData.resumen_ejecutivo}</p>
            </div>
            <a href="${reportUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Ver reporte completo
            </a>
          </div>
        `
      });
      console.log("Notificación interna enviada al equipo.");
    } catch (notifError) {
      console.error("Error enviando notificación interna:", notifError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error catastrófico en la API:", error);
    return NextResponse.json({ error: 'Fallo interno del servidor' }, { status: 500 });
  }
}