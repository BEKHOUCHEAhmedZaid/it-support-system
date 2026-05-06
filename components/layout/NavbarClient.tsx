'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarClientProps {
  user: any;
  profile: any;
  dashboardLink: string;
}

export function NavbarClient({ user, profile, dashboardLink }: NavbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else if (window.location.pathname !== '/') {
      // If not on homepage, navigate to homepage with hash
      window.location.href = `/#${targetId}`;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${isScrolled
            ? 'bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
            : 'bg-transparent py-5 border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="IT-Fix Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain brightness-0 invert opacity-90 drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, 'features')}
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors relative group"
            >
              Fonctionnalités
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors relative group"
            >
              Comment ça marche
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>

            {/* Show System Admin only if admin */}
            {profile?.role === 'admin' && (
              <Link href="/admin/tickets" className="text-[10px] font-black text-purple-400 uppercase tracking-widest border border-purple-500/30 bg-purple-500/10 px-3 py-1 rounded-full hover:bg-purple-500/20 transition-colors">
                System Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                href={dashboardLink}
                className="inline-flex items-center rounded-full bg-white/10 border border-white/10 px-6 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
              >
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link
                  href="/client/login"
                  className="px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/client/login"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Commencer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 top-[70px] bg-[#0A0F1C]/95 backdrop-blur-2xl border-b border-white/10 md:hidden flex flex-col items-center pt-8"
          >
            <nav className="flex flex-col items-center gap-6 w-full px-6">
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, 'features')}
                className="text-lg font-bold text-white hover:text-blue-400 transition-colors"
              >
                Fonctionnalités
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                className="text-lg font-bold text-white hover:text-blue-400 transition-colors"
              >
                Comment ça marche
              </a>

              {/* Support Admin link removed as requested */}

              <div className="w-full h-px bg-white/10 my-4"></div>

              {user ? (
                <Link
                  href={dashboardLink}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-full bg-white/10 border border-white/10 px-6 py-4 text-base font-bold text-white hover:bg-white/20 transition-all"
                >
                  Tableau de bord
                </Link>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  <Link
                    href="/client/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-full border border-white/10 px-6 py-4 text-base font-bold text-white hover:bg-white/5 transition-all"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/client/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-base font-bold text-white hover:opacity-90 transition-opacity"
                  >
                    Commencer
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
