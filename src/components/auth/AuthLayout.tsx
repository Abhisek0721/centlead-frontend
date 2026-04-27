import Link from 'next/link';

const BRAND_STATS = [
  { value: '10×', label: 'faster lead discovery' },
  { value: 'AI', label: 'powered scoring & ranking' },
  { value: '100%', label: 'customizable search goals' },
];

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading?: string;
}

export default function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left – brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{
          width: '52%',
          background: 'linear-gradient(150deg, #3730A3 0%, #4F46E5 45%, #7C3AED 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
            backgroundSize: '32px 32px',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#FFFFFF',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
            position: 'relative',
          }}
        >
          Centlead
        </Link>

        {/* Center content */}
        <div style={{ position: 'relative' }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(199,210,254,0.9)',
              marginBottom: 12,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            AI-Powered Lead Intelligence
          </p>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: 32,
              letterSpacing: '-0.5px',
            }}
          >
            Turn searches into
            <br />
            qualified leads.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {BRAND_STATS.map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    width: 52,
                    flexShrink: 0,
                  }}
                >
                  {s.value}
                </span>
                <span style={{ fontSize: 14, color: 'rgba(199,210,254,0.85)', fontWeight: 500 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: 'rgba(165,180,252,0.7)',
            fontWeight: 500,
            position: 'relative',
          }}
        >
          Discover • Enrich • Convert
        </p>
      </div>

      {/* Right – form panel */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Back link */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              marginBottom: 32,
              transition: 'color 0.2s',
            }}
          >
            ← Back to Centlead
          </Link>

          {/* Heading */}
          <div style={{ marginBottom: 24 }}>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              {heading}
            </h1>
            {subheading && (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                {subheading}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
