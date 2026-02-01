"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
import Fireworks from "@/components/ui/fireworks";

export default function Home() {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("home-scroll", { detail: scrollTop }));
    }
  };

  return (
    <div
      onScroll={handleScroll}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth text-white [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <Fireworks />
      {/* Fixed Background */}
      <div className="fixed top-0 left-0 h-full w-full -z-50 bg-[#050508] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("/hero-bg.png")' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
        {/* Animated Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-orange-500/20 blur-[150px] animate-pulse" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[100px]" />
      </div>

      {/* SECTION 1: HERO */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center"
        >
          {/* Logo */}
          <div className="mb-8 relative group">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center"
            >
              <img
                src="/original-logo.png"
                alt="Logo"
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(255,107,43,0.3)]"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[10px] md:text-xs text-orange-400 font-mono uppercase tracking-[0.3em]"
          >
            <Sparkles className="h-3 w-3" />
            Code Together, Vibe Forever
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight mb-6 px-4 py-4 max-w-[90vw] overflow-visible">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 px-2">Tucode</span>
            <br />
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 px-2">Pamoja</span>
          </h1>
        </motion.div>

        <motion.div
          className="absolute bottom-10 flex flex-col items-center gap-2 opacity-50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] tracking-[0.2em] font-mono">SCROLL</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* SECTION 2: MEANING (Tuko Pamoja) */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-orange-500 font-mono text-xl tracking-[0.5em] uppercase"
          >
            Etymology
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter"
          >
            "Tuko Pamoja"
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-2xl md:text-4xl font-light text-white/80 italic mb-12"
          >
            Means <span className="text-white font-bold not-italic">"We Are Together"</span> in Swahili.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto break-keep"
          >
            <p className="mb-6">
              코드 한 줄 한 줄이 모여 거대한 세상를 창조하듯,<br />
              우리는 각자의 고유한 색을 모아 하나의 선명한 빛이 됩니다.
            </p>
            <p>
              서로 다른 우리가 만나 <strong>'함께(Together)'</strong>라는 가치 안에서<br />
              가장 완벽한 조화를 이루는 곳.
            </p>
          </motion.div>
        </div>
        {/* Background Element */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-orange-600/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* SECTION 3: PHILOSOPHY (Romance in Technology) */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative px-6 bg-black/20 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-6 leading-tight">
              Warmth in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Technology</span>
            </h2>
            <div className="h-1 w-20 bg-white/20 mb-8" />
            <p className="text-lg md:text-2xl text-white/70 leading-relaxed break-keep">
              차가운 0과 1의 세계에도 온기가 필요합니다.<br />
              우리는 건조한 로직 속에 사람을 향한 진심을 담습니다.<br /><br />
              단순히 ‘기능하는’ 코드가 아닌,<br />
              누군가의 마음에 가 닿는 <strong>‘살아있는’</strong> 결과물을 만드는 것.
            </p>
            <p className="mt-6 text-pink-400 font-medium text-xl">
              그것이 투코드 파모자가 지향하는 낭만입니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[300px] md:h-[500px] w-full rounded-[3rem] overflow-hidden border border-white/10 group order-first md:order-last"
          >
            {/* Abstract Visual Representation */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black" />
            <img src="/hero-bg.png" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[2s]" alt="vibe" />

          </motion.div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter">
            Join the Vibe
          </h2>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/projects" className="group relative px-10 py-5 rounded-full bg-white text-black font-bold text-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow">
              <span className="relative z-10 flex items-center gap-2">
                EXPLORE PROJECTS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link href="/team" className="group px-10 py-5 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-xl backdrop-blur-sm transition-colors">
              MEET THE TEAM
            </Link>
          </div>
        </motion.div>

        <footer className="absolute bottom-6 w-full text-center opacity-30 text-xs font-mono uppercase tracking-widest">
          © 2024 TUCODE PAMOJA. All Logic, All Love.
        </footer>
      </section>
    </div>
  );
}
