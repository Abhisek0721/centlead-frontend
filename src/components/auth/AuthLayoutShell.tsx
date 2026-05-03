'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const MOCK_LEADS = [
  { name: 'Vertex Solutions', type: 'Enterprise · Munich',   score: 96, color: '#22C55E' },
  { name: 'NexaCloud Inc',    type: 'Mid-market · London',   score: 89, color: '#84CC16' },
  { name: 'DataForge GmbH',  type: 'Growth-stage · Berlin', score: 82, color: '#EAB308' },
  { name: 'Syncore Labs',     type: 'SMB · Amsterdam',       score: 74, color: '#F97316' },
];

const STATS = [
  { value: '10×',  label: 'pipeline growth' },
  { value: '94%',  label: 'lead score accuracy' },
  { value: '50+',  label: 'enrichment sources' },
];

export default function AuthLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex' }}>

      {/* ── Left: form ── */}
      <div
        className="relative z-10 flex w-full flex-col justify-center px-6 py-12 lg:w-1/2"
        style={{ minHeight: '100vh' }}
      >
        <div style={{ maxWidth: 440, margin: '0 auto', width: '100%' }}>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mb-10 group"
            style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textDecoration: 'none' }}
          >
            <ArrowLeft size={14} style={{ transition: 'transform 0.2s' }} className="group-hover:-translate-x-0.5" />
            <span style={{ transition: 'color 0.2s' }} className="group-hover:text-gray-700">
              Back to Centlead
            </span>
          </Link>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="gradient-text block mb-10" style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px' }}>
              Centlead
            </span>
          </Link>

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

      {/* ── Right: three-zone showcase ── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-1/2 flex-col"
        style={{
          background: 'linear-gradient(160deg, #13112b 0%, #0d0c22 40%, #07060f 100%)',
        }}
      >
        {/* Layered glow blobs */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 55% at 50% 42%, rgba(79,70,229,0.22) 0%, transparent 100%)',
        }} />
        <div className="pointer-events-none absolute" style={{
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          top: '15%', right: '-60px',
        }} />

        {/* ── Zone 1: Pitch ── */}
        <div style={{ padding: '52px 52px 0', position: 'relative', zIndex: 10 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: '#A5B4FC',
            backgroundColor: 'rgba(99,102,241,0.14)',
            border: '1px solid rgba(99,102,241,0.28)',
            padding: '5px 13px', borderRadius: 100,
            marginBottom: 22,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: '#818CF8', display: 'inline-block',
            }} />
            Lead Intelligence Platform
          </div>

          <h2 style={{
            fontSize: 34, fontWeight: 900, lineHeight: 1.14, letterSpacing: '-1px',
            color: '#FFFFFF', margin: '0 0 12px',
          }}>
            Find qualified leads<br />
            <span style={{
              background: 'linear-gradient(90deg, #818CF8, #C084FC)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              before competitors do.
            </span>
          </h2>

          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.38)', fontWeight: 400, margin: 0 }}>
            AI-powered discovery across 50+ enrichment sources.
          </p>
        </div>

        {/* ── Zone 2: Product mockup ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          padding: '44px 52px', position: 'relative', zIndex: 10,
        }}>
          <div style={{ position: 'relative', width: '100%' }}>

            {/* Floating: Job running */}
            <div className="animate-float-2" style={{
              position: 'absolute', top: -20, left: 0, zIndex: 20,
              backgroundColor: 'rgba(8,7,22,0.92)',
              borderRadius: 13, padding: '9px 13px',
              border: '1px solid rgba(255,255,255,0.11)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
              backdropFilter: 'blur(18px)',
              display: 'flex', alignItems: 'center', gap: 9,
              whiteSpace: 'nowrap',
            }}>
              <div className="animate-pulse-glow" style={{
                width: 7, height: 7, borderRadius: '50%',
                backgroundColor: '#22C55E', flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.92)', lineHeight: 1.3 }}>
                  Job running
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>SaaS companies · EU</div>
              </div>
            </div>

            {/* Browser frame */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.09)',
              overflow: 'hidden',
              boxShadow: '0 24px 72px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)',
            }}>
              {/* Chrome bar */}
              <div style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: 8,
                backgroundColor: 'rgba(0,0,0,0.32)',
              }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                    <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c }} />
                  ))}
                </div>
                <div style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 5, padding: '3px 10px',
                  fontSize: 11, color: 'rgba(255,255,255,0.26)',
                  fontWeight: 500, border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  app.centlead.io/leads
                </div>
              </div>

              {/* Table header */}
              <div style={{
                padding: '13px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                  Lead Results — SaaS · EU
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                  backgroundColor: 'rgba(99,102,241,0.2)', color: '#A5B4FC',
                }}>
                  Scored by fit
                </span>
              </div>

              {/* Lead rows */}
              {MOCK_LEADS.map((lead, i) => (
                <div key={lead.name} style={{
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: i < MOCK_LEADS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.88)' }}>
                      {lead.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.34)', marginTop: 2 }}>
                      {lead.type}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                      width: 58, height: 4, borderRadius: 100,
                      backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${lead.score}%`, height: '100%',
                        borderRadius: 100, backgroundColor: lead.color,
                      }} />
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 800, width: 22,
                      textAlign: 'right', color: lead.color,
                    }}>
                      {lead.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating: +48 leads */}
            <div className="animate-float" style={{
              position: 'absolute', bottom: -20, right: 0, zIndex: 20,
              backgroundColor: 'rgba(8,7,22,0.92)',
              borderRadius: 14, padding: '11px 15px',
              border: '1px solid rgba(255,255,255,0.11)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
              backdropFilter: 'blur(18px)',
              textAlign: 'center', minWidth: 110,
            }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginBottom: 3 }}>
                New this week
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#818CF8', lineHeight: 1 }}>
                +48
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#22C55E', marginTop: 4 }}>
                ↑ leads found
              </div>
            </div>

          </div>
        </div>

        {/* ── Zone 3: Stats ── */}
        <div style={{
          padding: '20px 52px 48px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          position: 'relative', zIndex: 10,
          display: 'flex', gap: 0,
        }}>
          {STATS.map((s, i) => (
            <div key={s.value} style={{
              flex: 1,
              paddingLeft: i > 0 ? 28 : 0,
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              marginLeft: i > 0 ? 28 : 0,
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 5, fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Subtle edge vignette */}
        <div className="pointer-events-none absolute inset-0" style={{
          boxShadow: 'inset 60px 0 80px rgba(0,0,0,0.25), inset 0 0 120px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  );
}
