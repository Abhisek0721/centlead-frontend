'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SunOutlined, MoonOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useTheme } from '@providers/ThemeProvider';
import envConstant from '@constants/envConstant';

const NAV_LINKS = ['Features', 'Pricing', 'Docs'];

export default function NavBar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled ? 'var(--bg-overlay)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div
        style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', height: 64 }}
        className="flex items-center justify-between"
      >
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="text-xl font-black gradient-text bg-transparent border-0 cursor-pointer p-0"
        >
          Centlead
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <span
              key={link}
              className="text-sm font-medium cursor-pointer transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link}
            </span>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px',
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s',
              fontSize: 16,
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          </button>

          <button
            onClick={() => router.push('/login')}
            className="hidden md:block text-sm font-semibold transition-colors bg-transparent border-0 cursor-pointer px-3 py-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Sign in
          </button>

          <button
            onClick={() => router.push('/signup')}
            className="text-sm font-bold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] border-0 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              boxShadow: '0 0 30px -8px rgba(79,70,229,0.5)',
            }}
          >
            Get started →
          </button>

          <button
            className="md:hidden p-2 rounded-lg border-0 bg-transparent cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-5 flex flex-col gap-3"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {NAV_LINKS.map((link) => (
            <span
              key={link}
              className="text-sm font-medium py-2 cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              {link}
            </span>
          ))}
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-medium py-2 text-left border-0 bg-transparent cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
          >
            Sign in
          </button>
        </div>
      )}
    </nav>
  );
}
