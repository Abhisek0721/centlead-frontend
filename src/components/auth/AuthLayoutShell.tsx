'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import LoginInteractiveParticles from './LoginInteractiveParticles';

const STATS = [
  { value: '10×', label: 'pipeline growth' },
  { value: '94%', label: 'lead score accuracy' },
  { value: '50+', label: 'enrichment sources' },
];

export default function AuthLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex' }}>

      {/* ── Left — form panel ── */}
      <div
        className="relative z-10 flex w-full flex-col justify-center px-6 py-12 lg:w-1/2"
        style={{ minHeight: '100vh' }}
      >
        <div style={{ maxWidth: 440, margin: '0 auto', width: '100%' }}>

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mb-10 group"
            style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textDecoration: 'none' }}
          >
            <ArrowLeft
              size={14}
              style={{ transition: 'transform 0.2s' }}
              className="group-hover:-translate-x-0.5"
            />
            <span style={{ transition: 'color 0.2s' }} className="group-hover:text-gray-700">
              Back to Centlead
            </span>
          </Link>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              className="gradient-text block mb-10"
              style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px' }}
            >
              Centlead
            </span>
          </Link>

          {/* Animated content area — switches between /login and /signup */}
          <div style={{ overflow: 'hidden' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 28, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -28, filter: 'blur(8px)' }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Right — dark animated panel ── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-1/2 items-center justify-center"
        style={{
          background:
            'radial-gradient(ellipse at 40% 50%, #1e1b4b 0%, #0f0d2a 50%, #07060f 100%)',
        }}
      >
        <LoginInteractiveParticles />

        {/* Inset vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)' }}
        />

        {/* Stats — top left */}
        <div className="absolute top-10 left-10 z-20 space-y-3">
          {STATS.map((s) => (
            <div key={s.value} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>{s.value}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Status — bottom right */}
        <div className="absolute bottom-10 right-10 z-20 text-right">
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: 6,
            }}
          >
            System Status
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
            <div
              className="animate-pulse-glow"
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#4ADE80',
                boxShadow: '0 0 10px #4ade80',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
              Discovery Engine Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
