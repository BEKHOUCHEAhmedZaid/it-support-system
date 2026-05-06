"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  ArrowRight, 
  MessageSquare, 
  Activity, 
  Shield, 
  Zap, 
  Search, 
  Star,
  Terminal,
  Server,
  Cpu,
  Globe
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="flex flex-col w-full min-h-screen bg-[#0A0F1C] text-slate-50 selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden font-sans">
      
      {/* ─── FLOATING BACKGROUND ELEMENTS ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated glowing orbs */}
        <motion.div 
          animate={{ 
            x: ["0%", "5%", "-5%", "0%"],
            y: ["0%", "-10%", "5%", "0%"],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: ["0%", "-5%", "5%", "0%"],
            y: ["0%", "10%", "-5%", "0%"],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: ["0%", "10%", "-10%", "0%"],
            y: ["0%", "-5%", "5%", "0%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[30%] w-[30%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" 
        />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Noise texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-24 lg:pt-48 lg:pb-32">
        <motion.div 
          style={{ y, opacity }}
          className="relative flex flex-col items-center max-w-5xl mx-auto w-full"
        >
          {/* Version Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-blue-300 mb-8 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:bg-white/10 transition-colors cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            IT-Fix Platform v2.0
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] max-w-5xl"
          >
            Le support IT, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
              réinventé.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl font-medium"
          >
            Connectez vos collaborateurs aux meilleurs techniciens pour une résolution instantanée. Une expérience fluide, ultra-rapide et transparente.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-5 mt-12 w-full max-w-md mx-auto sm:max-w-none sm:justify-center"
          >
            <Link
              href="/client/login"
              className="group relative flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 flex items-center gap-2">
                Espace Client
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/technician/login"
              className="group relative flex items-center justify-center gap-3 rounded-full bg-white/5 border border-white/10 px-8 py-4 text-sm font-bold text-slate-300 backdrop-blur-md hover:bg-white/10 hover:text-white hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Terminal className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              Accès Technicien
            </Link>
          </motion.div>
          
          {/* Floating UI Dashboard Preview */}
          <motion.div
             initial={{ opacity: 0, y: 60, rotateX: 20 }}
             animate={{ opacity: 1, y: 0, rotateX: 0 }}
             transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
             style={{ perspective: "1000px" }}
             className="mt-24 relative w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-2 shadow-[0_0_100px_-20px_rgba(37,99,235,0.3)] overflow-hidden hidden sm:block"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent z-10"></div>
             <div className="rounded-2xl overflow-hidden border border-white/5 bg-slate-950/50 h-[300px] md:h-[450px] flex items-center justify-center relative shadow-inner">
                {/* Dashboard Skeleton */}
                <div className="w-full h-full flex flex-col p-6 gap-4 opacity-80">
                  {/* Topbar */}
                  <div className="h-12 w-full bg-white/5 rounded-xl border border-white/5 shadow-sm flex items-center px-4 gap-4 backdrop-blur-sm">
                     <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                     </div>
                     <div className="h-4 w-48 bg-white/10 rounded ml-4"></div>
                     <div className="ml-auto h-6 w-24 bg-blue-500/20 rounded-full border border-blue-500/30"></div>
                  </div>
                  <div className="flex gap-6 h-full">
                    {/* Sidebar */}
                    <div className="w-64 bg-white/5 rounded-2xl border border-white/5 shadow-sm p-4 hidden md:block backdrop-blur-sm">
                      <div className="h-6 w-24 bg-white/10 rounded mb-8 mt-2"></div>
                      <div className="space-y-4">
                         <div className="h-10 w-full bg-blue-500/20 border border-blue-500/30 rounded-xl"></div>
                         <div className="h-10 w-full bg-white/5 rounded-xl"></div>
                         <div className="h-10 w-full bg-white/5 rounded-xl"></div>
                         <div className="h-10 w-full bg-white/5 rounded-xl mt-8"></div>
                      </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 shadow-sm p-6 flex flex-col gap-6 backdrop-blur-sm">
                       <div className="flex justify-between items-center pb-4 border-b border-white/5">
                          <div className="space-y-2">
                             <div className="h-6 w-48 bg-white/20 rounded"></div>
                             <div className="h-4 w-32 bg-white/10 rounded"></div>
                          </div>
                          <div className="h-10 w-32 bg-blue-600/80 rounded-xl shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]"></div>
                       </div>
                       <div className="flex-1 rounded-xl border border-white/5 bg-black/20 p-6 flex gap-6">
                         {/* List */}
                         <div className="w-1/3 space-y-3">
                            <div className="h-20 w-full bg-white/10 rounded-xl border border-white/5"></div>
                            <div className="h-20 w-full bg-blue-500/10 rounded-xl border border-blue-500/20"></div>
                            <div className="h-20 w-full bg-white/5 rounded-xl border border-white/5"></div>
                         </div>
                         {/* Detail View */}
                         <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-6 flex flex-col gap-4">
                            <div className="h-8 w-3/4 bg-white/20 rounded"></div>
                            <div className="h-4 w-1/4 bg-white/10 rounded mb-4"></div>
                            <div className="flex gap-3 mt-auto">
                              <div className="h-12 flex-1 bg-white/5 rounded-xl"></div>
                              <div className="h-12 w-12 bg-blue-600/80 rounded-xl"></div>
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── LOGO CLOUD ─────────────────────────────────────── */}
      <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-500 mb-8 uppercase tracking-[0.2em]">Entreprises qui nous font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-60">
             <div className="flex items-center gap-2 font-bold text-xl text-slate-400 hover:text-white transition-colors cursor-default"><Server className="w-6 h-6"/> TechFlow</div>
             <div className="flex items-center gap-2 font-bold text-xl text-slate-400 hover:text-white transition-colors cursor-default"><Globe className="w-6 h-6"/> Nexus</div>
             <div className="flex items-center gap-2 font-bold text-xl text-slate-400 hover:text-white transition-colors cursor-default"><Cpu className="w-6 h-6"/> Zenith</div>
             <div className="flex items-center gap-2 font-bold text-xl text-slate-400 hover:text-white transition-colors cursor-default"><Shield className="w-6 h-6"/> SecureNet</div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20 max-w-2xl mx-auto"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Pensé pour la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">performance</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="mt-6 text-xl text-slate-400 font-medium">
              Des outils ultra-réactifs qui éliminent la friction et accélèrent la résolution de vos incidents IT.
            </motion.p>
          </motion.div>

          <motion.div 
             initial="initial"
             whileInView="animate"
             viewport={{ once: true, margin: "-100px" }}
             variants={staggerContainer}
             className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeIn} className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)]">
                 <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Auto-Diagnostic</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Capture automatique des données système. Nos techniciens comprennent votre problème avant même de vous parler.
              </p>
            </motion.div>

            {/* Feature 2 (Highlighted) */}
            <motion.div variants={fadeIn} className="bg-gradient-to-b from-blue-600/20 to-indigo-900/20 backdrop-blur-md rounded-[2rem] p-8 border border-blue-500/30 hover:border-blue-400/50 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] group-hover:scale-110 transition-transform duration-500">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Chat Temps Réel</h3>
                <p className="text-blue-100/70 leading-relaxed font-medium">
                  Communication fluide et instantanée avec le technicien assigné. Suivi transparent de chaque action.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeIn} className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
                 <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Suivi Proactif</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Notifications instantanées et historique complet. Une traçabilité parfaite pour vos demandes IT.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-32 bg-slate-950/50 border-y border-white/5 relative z-10 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
         
         <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div 
               initial="initial"
               whileInView="animate"
               viewport={{ once: true, margin: "-100px" }}
               variants={fadeIn}
               className="text-center mb-24 max-w-2xl mx-auto"
            >
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  La simplicité <span className="italic font-light text-slate-400">avant tout</span>
               </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
               {/* Animated Connecting Line */}
               <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-white/5 -z-0">
                 <motion.div 
                   initial={{ scaleX: 0, opacity: 0 }}
                   whileInView={{ scaleX: 1, opacity: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                   className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 origin-left"
                 />
               </div>

               {/* Step 1 */}
               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center group"
               >
                  <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center text-slate-300 font-bold text-2xl mb-8 group-hover:border-blue-500/50 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-500">
                     01
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Signalement</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">Décrivez l'incident en 2 clics. L'auto-diagnostic fait le reste.</p>
               </motion.div>

               {/* Step 2 */}
               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative z-10 flex flex-col items-center text-center group"
               >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] flex items-center justify-center text-white font-bold text-2xl mb-8 group-hover:scale-110 transition-all duration-500">
                     <Zap className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Expertise Garantie</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">Entrez directement en contact avec notre réseau de techniciens qualifiés pour une résolution experte.</p>
               </motion.div>

               {/* Step 3 */}
               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative z-10 flex flex-col items-center text-center group"
               >
                  <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center text-slate-300 font-bold text-2xl mb-8 group-hover:border-emerald-500/50 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500">
                     03
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Résolution</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">Échangez en direct, suivez la progression et validez la clôture.</p>
               </motion.div>
            </div>
         </div>
      </section>

      {/* ─── CTA SECTION ─────────────────────────────────── */}
      <section className="py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-b from-blue-600/20 to-transparent border border-blue-500/20 rounded-[3rem] p-12 md:p-20 relative overflow-hidden backdrop-blur-sm"
          >
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-blue-500/30 blur-[80px] rounded-full"></div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Prêt à accélérer ?
            </h2>
            <p className="text-blue-200/70 text-xl mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
              Passez à la vitesse supérieure et offrez à votre équipe le support technique qu'elle mérite.
            </p>
            <Link
              href="/client/login"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-5 text-base font-bold text-blue-950 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Lancer la plateforme
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer className="bg-[#05080f] pt-24 pb-12 border-t border-white/10 relative z-10 overflow-hidden">
        {/* Footer Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>
        {/* Top border glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 relative z-10">
          <div className="col-span-1 md:col-span-5">
            <Link href="/" className="flex items-center mb-8 group inline-flex">
              <img src="/logo.png" alt="IT-Fix Logo" className="h-12 md:h-16 w-auto object-contain brightness-0 invert opacity-90 drop-shadow-lg group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
              La plateforme de support technique de nouvelle génération. Rapide, intelligente et pensée pour l'excellence.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-3 md:col-start-7">
            <h4 className="text-xs font-bold text-white mb-6 uppercase tracking-widest opacity-80">Plateforme</h4>
            <ul className="space-y-4">
              <li><Link href="/client/login" className="text-sm text-slate-400 font-medium hover:text-blue-400 transition-colors">Espace Client</Link></li>
              <li><Link href="/technician/login" className="text-sm text-slate-400 font-medium hover:text-blue-400 transition-colors">Accès Technicien</Link></li>
              <li><Link href="/admin/login" className="text-sm text-slate-400 font-medium hover:text-purple-400 transition-colors">Admin Système</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            <h4 className="text-xs font-bold text-white mb-6 uppercase tracking-widest opacity-80">Ressources</h4>
            <ul className="space-y-4">
              <li><Link href="/client/faq" className="text-sm text-slate-400 font-medium hover:text-white transition-colors">Centre d'aide & FAQ</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 font-medium hover:text-white transition-colors">Documentation API</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 font-medium hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <p className="text-sm text-slate-500 font-medium">© 2024 IT‑Fix Platform. Tous droits réservés.</p>
          <div className="flex gap-4">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">Amine · Rayan · Ahmed</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
