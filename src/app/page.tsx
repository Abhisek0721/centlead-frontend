'use client';

import { useRouter } from 'next/navigation';
import NavBar from '@components/layout/NavBar';
import envConstant from '@constants/envConstant';
import {
  Search,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2,
  X,
  Star,
  BarChart3,
  Shield,
  Download,
} from 'lucide-react';

/* ───────── data ───────── */

const LEAD_CARDS = [
  { name: 'Vertex Solutions', type: 'Enterprise · Munich', score: 96, color: '#22C55E' },
  { name: 'NexaCloud Inc', type: 'Mid-market · London', score: 89, color: '#84CC16' },
  { name: 'DataForge GmbH', type: 'Growth-stage · Berlin', score: 82, color: '#EAB308' },
  { name: 'Syncore Labs', type: 'SMB · Amsterdam', score: 74, color: '#F97316' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Define your target',
    desc: 'Describe your ideal customer — industry, company size, region, and what you are looking to achieve. Plain language, no complex setup.',
  },
  {
    step: '02',
    title: 'We find the matches',
    desc: 'Centlead scans hundreds of sources, identifies companies that fit your criteria, and extracts the contact details you need.',
  },
  {
    step: '03',
    title: 'Review and reach out',
    desc: 'Every lead arrives ranked by fit. Highest-opportunity prospects at the top. Export to your CRM and start outreach immediately.',
  },
];

const FEATURES = [
  {
    icon: Search,
    title: 'Intelligent discovery',
    desc: 'Not just keyword matching — Centlead understands context, industry signals, and buying intent to surface the most relevant prospects.',
  },
  {
    icon: BarChart3,
    title: 'Automatic scoring',
    desc: "Every lead gets a fit score based on your goals — so you always know who's worth pursuing first without reading every profile.",
  },
  {
    icon: Users,
    title: 'Team collaboration',
    desc: 'Share jobs, split credit allocations, and keep the whole team aligned — built for sales teams, not just individuals.',
  },
  {
    icon: Download,
    title: 'Export-ready data',
    desc: 'Every lead comes enriched and structured. Export to CSV, push to your CRM, or pipe into your outreach sequences.',
  },
  {
    icon: Shield,
    title: 'Privacy compliant',
    desc: 'Only publicly available data. No scraping personal accounts. Safe to use and easy to justify to legal and compliance teams.',
  },
  {
    icon: Zap,
    title: 'Built to scale',
    desc: 'Run a focused search for 50 leads or a market-wide scan for 10,000. Centlead handles both without slowing down.',
  },
];

const PAIN_POINTS = [
  'Spending hours on manual research per prospect',
  'Missing companies your competitors are already talking to',
  'Unscored lead lists that waste your team\'s time',
  'Stale data from monthly database exports',
];

const PRICING = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mo',
    desc: '2,000 credits per month.',
    features: ['2,000 credits / month', 'Lead generation', 'Lead scoring', 'Export leads', '1 workspace'],
    cta: 'Start 7-day trial',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$79',
    period: '/mo',
    desc: '8,000 credits per month.',
    features: ['8,000 credits / month', 'Advanced scoring', 'Website analysis', 'Lead exports', 'Priority processing'],
    cta: 'Start 7-day trial',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/mo',
    desc: '25,000 credits per month.',
    features: ['25,000 credits / month', 'Team accounts', 'Advanced filters', 'Bulk jobs', 'All Growth features'],
    cta: 'Start 7-day trial',
    highlight: false,
  },
  {
    name: 'Agency',
    price: '$299',
    period: '/mo',
    desc: '100,000 credits per month.',
    features: ['100,000 credits / month', 'API access', 'Team collaboration', 'Priority processing', 'Dedicated support'],
    cta: 'Start 7-day trial',
    highlight: false,
  },
];

/* ───────── component ───────── */

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      <NavBar />

      {/* ══════════ HERO ══════════ */}
      <section
        style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        {/* Left */}
        <div className="flex flex-col gap-6">
          <div
            className="inline-flex w-fit items-center gap-2 animate-fade-up"
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--brand)',
              backgroundColor: 'var(--brand-light)',
              padding: '6px 14px',
              borderRadius: 100,
            }}
          >
            Lead Intelligence Platform
          </div>

          <h1
            className="animate-fade-up animation-delay-1"
            style={{
              fontSize: 'clamp(42px, 5vw, 62px)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-1.5px',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Stop prospecting
            <br />
            <span className="gradient-text">blind.</span>
          </h1>

          <p
            className="animate-fade-up animation-delay-2"
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: 480,
              margin: 0,
              fontWeight: 400,
            }}
          >
            Centlead maps your market, finds matching companies, and surfaces
            the highest-opportunity prospects — before your competitors reach them.
          </p>

          <div className="flex flex-wrap gap-3 animate-fade-up animation-delay-3">
            <button
              onClick={() => router.push('/signup')}
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                boxShadow: '0 0 40px -10px rgba(79,70,229,0.55)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 14,
                padding: '15px 28px',
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'opacity 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Start your first search <ArrowRight size={16} />
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '15px 24px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              See how it works
            </button>
          </div>

          <p
            className="animate-fade-up animation-delay-4"
            style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}
          >
            No credit card required · Free trial on every plan
          </p>
        </div>

        {/* Right — product mockup */}
        <div className="relative hidden lg:block animate-fade-up animation-delay-2">
          {/* Browser frame */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 20,
              border: '1px solid var(--border)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Browser chrome */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'var(--bg-base)',
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  border: '1px solid var(--border)',
                }}
              >
                app.centlead.io/leads
              </div>
            </div>

            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                Lead Results — SaaS · EU
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 100,
                  backgroundColor: 'var(--brand-light)',
                  color: 'var(--brand)',
                }}
              >
                Scored by fit
              </span>
            </div>

            {/* Lead rows */}
            {LEAD_CARDS.map((lead, i) => (
              <div
                key={lead.name}
                style={{
                  padding: '13px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: i < LEAD_CARDS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background-color 0.12s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-base)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {lead.type}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 68,
                      height: 5,
                      borderRadius: 100,
                      backgroundColor: 'var(--border)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{ width: `${lead.score}%`, height: '100%', borderRadius: 100, backgroundColor: lead.color }}
                    />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, width: 26, textAlign: 'right', color: lead.color }}>
                    {lead.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating — new leads */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: -18,
              right: -18,
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 16,
              padding: '12px 16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>New this week</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand)', lineHeight: 1 }}>+48</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', marginTop: 3 }}>↑ leads found</div>
          </div>

          {/* Floating — job status */}
          <div
            className="animate-float-2"
            style={{
              position: 'absolute',
              top: -16,
              left: -16,
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 14,
              padding: '10px 14px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              className="animate-pulse-glow"
              style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22C55E', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Job running</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>SaaS companies · EU</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '40px 24px',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '10×', l: 'faster discovery' },
            { n: '100+', l: 'data sources' },
            { n: '85%', l: 'less prospecting time' },
            { n: '∞', l: 'searches per job' },
          ].map((s) => (
            <div key={s.n}>
              <div className="gradient-text" style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ PAIN POINTS ══════════ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 900,
                letterSpacing: '-0.8px',
                color: 'var(--text-primary)',
                margin: '0 0 16px',
                lineHeight: 1.15,
              }}
            >
              You're leaving deals
              <br />on the table.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 32px' }}>
              The traditional approach to prospecting is broken. It's slow, incomplete, and lets
              the best opportunities slip through every day.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {PAIN_POINTS.map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <X size={17} style={{ color: '#EF4444', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 500 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 24,
              padding: 36,
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              className="gradient-text"
              style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}
            >
              With Centlead
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'Full market coverage in minutes, not weeks',
                'Every lead scored before you see it',
                'Freshly discovered data, not stale exports',
                'Your team focuses only on high-fit prospects',
              ].map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={17} style={{ color: '#22C55E', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section
        id="how-it-works"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '96px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: 64 }}>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 900,
                letterSpacing: '-0.8px',
                color: 'var(--text-primary)',
                margin: '0 0 14px',
              }}
            >
              How it works
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', margin: 0, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              From idea to qualified leads in three steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                style={{
                  position: 'relative',
                  padding: '8px 0',
                }}
              >
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="hidden md:block absolute"
                    style={{
                      top: 28,
                      right: -40,
                      width: 80,
                      height: 1,
                      backgroundColor: 'var(--border)',
                      zIndex: 0,
                    }}
                  />
                )}
                <div
                  className="gradient-text"
                  style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}
                >
                  {step.step}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <div className="text-center" style={{ marginBottom: 64 }}>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 900,
              letterSpacing: '-0.8px',
              color: 'var(--text-primary)',
              margin: '0 0 14px',
            }}
          >
            Everything you need
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', margin: 0, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Built for teams that take prospecting seriously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 20,
                  padding: '28px 28px',
                  border: '1px solid var(--border)',
                  transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = 'var(--shadow-md)';
                  el.style.transform = 'translateY(-2px)';
                  el.style.borderColor = 'rgba(79,70,229,0.15)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = 'none';
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = 'var(--border)';
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: 'var(--brand-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 18,
                  }}
                >
                  <Icon size={20} style={{ color: 'var(--brand)' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '96px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: 64 }}>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 900,
                letterSpacing: '-0.8px',
                color: 'var(--text-primary)',
                margin: '0 0 14px',
              }}
            >
              Simple pricing
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', margin: 0 }}>
              Every plan starts with a <strong style={{ color: 'var(--text-primary)' }}>7-day free trial</strong> — 300 credits included, no card required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                style={{
                  backgroundColor: plan.highlight ? 'var(--brand)' : 'var(--bg-elevated)',
                  borderRadius: 24,
                  padding: '36px 32px',
                  border: plan.highlight ? 'none' : '1px solid var(--border)',
                  boxShadow: plan.highlight ? 'var(--shadow-brand)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {plan.highlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 100,
                      padding: '3px 10px',
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Star size={11} fill="currentColor" /> Most popular
                  </div>
                )}

                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                      marginBottom: 12,
                    }}
                  >
                    {plan.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <span
                      style={{
                        fontSize: 40,
                        fontWeight: 900,
                        color: plan.highlight ? '#FFFFFF' : 'var(--text-primary)',
                        letterSpacing: '-1px',
                      }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span style={{ fontSize: 16, color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', fontWeight: 500 }}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.65)' : 'var(--text-secondary)', margin: '8px 0 0', fontWeight: 400 }}>
                    {plan.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {plan.features.map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle2
                        size={15}
                        style={{ color: plan.highlight ? 'rgba(255,255,255,0.8)' : '#22C55E', flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)',
                          fontWeight: 500,
                        }}
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push('/signup')}
                  style={{
                    padding: '14px',
                    borderRadius: 14,
                    border: plan.highlight ? 'none' : '1px solid var(--border)',
                    backgroundColor: plan.highlight ? 'rgba(255,255,255,0.15)' : 'var(--bg-surface)',
                    color: plan.highlight ? '#FFFFFF' : 'var(--text-primary)',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backdropFilter: plan.highlight ? 'blur(8px)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  {plan.cta} <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <div
          style={{
            background: 'linear-gradient(140deg, #3730A3 0%, #4F46E5 45%, #7C3AED 100%)',
            borderRadius: 28,
            padding: '72px 48px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Dot grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
              backgroundSize: '28px 28px',
              pointerEvents: 'none',
            }}
          />
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 14px',
              position: 'relative',
              letterSpacing: '-0.8px',
            }}
          >
            Ready to fill your pipeline?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(199,210,254,0.85)', margin: '0 0 36px', position: 'relative' }}>
            Start your first search free. No card required.
          </p>
          <button
            onClick={() => router.push('/signup')}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#4F46E5',
              border: 'none',
              borderRadius: 14,
              padding: '16px 32px',
              fontSize: 15,
              fontWeight: 900,
              cursor: 'pointer',
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EEF2FF')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            Get started free <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '36px 24px' }}>
        <div
          style={{ maxWidth: 1200, margin: '0 auto' }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <span className="gradient-text" style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.3px' }}>
            Centlead
          </span>
          <div className="flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'Privacy'].map((l) => (
              <span
                key={l}
                style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}
              >
                {l}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2025 Centlead</span>
        </div>
      </footer>
    </div>
  );
}
