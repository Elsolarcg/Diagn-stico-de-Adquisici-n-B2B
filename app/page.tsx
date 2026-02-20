'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import Reveal from "./components/Reveal";

/* ─────────────────────────────────────────────
   Iconos SVG (Definiciones completas)
───────────────────────────────────────────── */
function IconSearch() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>; }
function IconStar() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>; }
function IconShare() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>; }
function IconGlobe() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>; }
function IconMapPin() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>; }
function IconTrending() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>; }
function IconArrow() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }

/* ─────────────────────────────────────────────
   Datos Estáticos
───────────────────────────────────────────── */
const stats = [
  { value: "1,247",  label: "negocios analizados esta semana" },
  { value: "97%",    label: "detectaron al menos un problema crítico" },
  { value: "< 2 min", label: "tiempo promedio de diagnóstico" },
];

const features = [
  { icon: <IconSearch />, label: "VISIBILIDAD LOCAL", title: "Google Business & SEO local", desc: "Auditamos si apareces donde tus clientes te buscan.", accent: "purple", wide: true },
  { icon: <IconStar />, label: "REPUTACIÓN", title: "Reseñas y confianza online", desc: "Auditamos volumen y calidad de confianza.", accent: "green", wide: false },
  { icon: <IconShare />, label: "REDES SOCIALES", title: "Presencia en redes", desc: "Auditamos la consistencia de tu marca.", accent: "purple", wide: false },
  { icon: <IconGlobe />, label: "SITIO WEB", title: "Web: velocidad y conversión", desc: "Revisamos carga y claridad del mensaje.", accent: "green", wide: false },
  { icon: <IconMapPin />, label: "DIRECTORIOS", title: "Listados y datos locales", desc: "Corregimos información en directorios globales.", accent: "purple", wide: false },
  { icon: <IconTrending />, label: "INFORME", title: "Plan de acción priorizado", desc: "Las 3 acciones de mayor impacto inmediato.", accent: "green", wide: true },
];

const steps = [
  { num: "01", title: "Ingresa tu email de negocio", desc: "Es el único dato que necesitamos para empezar." },
  { num: "02", title: "Responde 6 preguntas clave", desc: "Nuestro motor analiza tu sistema comercial." },
  { num: "03", title: "Recibe tu informe al instante", desc: "Un diagnóstico claro con puntuación y próximos pasos." },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    router.push(`/analyze?email=${encodeURIComponent(email)}`);
  };

  return (
    <main className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen transition-colors duration-300">

      {/* ══ NAVBAR ══ */}
      <header className="sticky top-0 z-50 border-b border-light-border dark:border-dark-border bg-light-card/70 dark:bg-dark-card/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-accent text-xs uppercase tracking-[0.22em]">
            Diagn<span className="text-blue-500">.</span>YA
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden min-h-[calc(100vh-56px)] flex items-center">
        <div className="absolute inset-0 grid-pattern text-light-text dark:text-dark-text pointer-events-none opacity-20" />
        
        <div className="relative max-w-5xl mx-auto px-6 py-32 w-full">
          <p className="hero-item hero-d1 font-accent text-[10px] uppercase tracking-[0.32em] text-light-muted dark:text-dark-muted mb-8">
            Diagnóstico B2B · Sistema Inteligente de Ventas
          </p>

          <h1 className="hero-item hero-d2 font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-medium leading-[1.04] tracking-tight max-w-4xl mb-8">
            Tu negocio está <span className="text-red-500">perdiendo clientes.</span><br />
            Te mostramos <span className="text-blue-500">dónde.</span>
          </h1>

          <div className="hero-item hero-d3 w-10 h-px bg-light-border dark:bg-dark-border mb-8" />

          {/* FORMULARIO DE CAPTURA INICIAL */}
          <form onSubmit={handleStart} className="hero-item hero-d4 max-w-md space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email"
                required
                placeholder="Tu email corporativo"
                className="flex-1 bg-transparent border border-light-border dark:border-dark-border px-6 py-4 font-sans font-light text-sm outline-none focus:border-blue-500 transition-colors dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit"
                className="btn-fill inline-flex items-center justify-center gap-3 border border-blue-600 bg-blue-600 text-white font-accent text-[10px] uppercase tracking-[0.22em] px-8 py-4 hover:bg-blue-700 transition-all"
              >
                <span>Analizar</span>
                <IconArrow />
              </button>
            </div>
            <p className="font-accent text-[8px] uppercase tracking-[0.22em] text-light-muted dark:text-dark-muted">
              Sin tarjeta · Resultado instantáneo · 100% Gratuito
            </p>
          </form>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section className="border-y border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-light-border dark:divide-dark-border">
            {stats.map(({ value, label }, i) => (
              <Reveal key={label} delay={i * 80} className="px-10 py-14">
                <p className="font-display text-4xl font-medium mb-2">{value}</p>
                <p className="font-accent text-[10px] uppercase tracking-[0.22em] text-light-muted dark:text-dark-muted">{label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES BENTO ══ */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <Reveal className="mb-20">
          <p className="font-accent text-[10px] uppercase tracking-[0.32em] text-light-muted dark:text-dark-muted mb-4">Qué analizamos</p>
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight max-w-xl">Cada canal donde tus clientes te buscan.</h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-light-border dark:bg-dark-border border border-light-border dark:border-dark-border">
          {features.map(({ icon, label, title, desc, accent, wide }, i) => (
            <Reveal key={title} delay={i * 55} className={`relative bg-light-card dark:bg-dark-card p-8 overflow-hidden ${wide ? "sm:col-span-2 lg:col-span-2" : ""}`}>
              <div className={`absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none ${accent === "purple" ? "bg-purple-500/5" : "bg-green-500/5"}`} />
              <span className="text-light-muted dark:text-dark-muted mb-6 block">{icon}</span>
              <p className="font-accent text-[10px] uppercase tracking-[0.22em] text-light-muted dark:text-dark-muted mb-3">{label}</p>
              <h3 className="font-display text-lg font-medium mb-3">{title}</h3>
              <p className="font-sans font-light text-sm text-light-muted dark:text-dark-muted leading-relaxed">{desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="border-t border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
        <div className="max-w-6xl mx-auto px-6 py-32">
          <Reveal className="mb-20">
            <p className="font-accent text-[10px] uppercase tracking-[0.32em] text-light-muted dark:text-dark-muted mb-4">El proceso</p>
            <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">Tres pasos. Ningún rodeo.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-light-border dark:bg-dark-border border border-light-border dark:border-dark-border">
            {steps.map(({ num, title, desc }, i) => (
              <Reveal key={num} delay={i * 100} className="bg-light-bg dark:bg-dark-bg p-10">
                <span className="font-display text-7xl font-medium text-light-border dark:text-dark-border block mb-8 select-none leading-none">{num}</span>
                <h3 className="font-display text-base font-medium mb-3">{title}</h3>
                <p className="font-sans font-light text-sm text-light-muted dark:text-dark-muted leading-relaxed">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <Reveal className="relative overflow-hidden border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-14 sm:p-20 text-center flex flex-col items-center">
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight mb-12 leading-tight max-w-2xl">
            No hacemos pitch de ventas.<br />Hacemos diagnóstico.
          </h2>
          
          <form onSubmit={handleStart} className="w-full max-w-sm flex flex-col gap-4">
            <input 
              type="email"
              required
              placeholder="Introduce tu email para comenzar"
              className="bg-transparent border border-light-border dark:border-dark-border px-6 py-4 font-sans font-light text-sm outline-none focus:border-blue-500 transition-colors dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              type="submit"
              className="btn-fill w-full border border-blue-600 bg-blue-600 text-white font-accent text-[10px] uppercase tracking-[0.22em] py-4 hover:bg-blue-700 transition-all"
            >
              Obtener mi reporte gratuito
            </button>
          </form>
        </Reveal>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-light-border dark:border-dark-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <span className="font-accent text-xs uppercase tracking-[0.22em]">Diagn.YA</span>
          <p className="font-accent text-[10px] uppercase tracking-[0.22em] text-light-muted dark:text-dark-muted">
            © {new Date().getFullYear()} · Diagnóstico digital B2B
          </p>
        </div>
      </footer>
    </main>
  );
}