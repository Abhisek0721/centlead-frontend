'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import envConstant from '@constants/envConstant';

function applyToken(token: string) {
  localStorage.setItem('centlead_token', token);
  document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function useResendCooldown() {
  const [countdown, setCountdown] = useState(60);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  function start() {
    setCountdown(60);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(timer.current!); return 0; } return c - 1; });
    }, 1000);
  }
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  return { countdown, start, active: countdown > 0 };
}

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [err, setErr] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [done, setDone] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const resend = useResendCooldown();

  if (!resetToken) {
    return (
      <div style={CARD}>
        <ErrorIcon />
        <h1 style={H1}>Invalid link</h1>
        <p style={SUB}>This reset link is missing or invalid. Please request a new one.</p>
        <Btn onClick={() => router.replace('/login')}>Back to login</Btn>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (password.length < 8) { setErr('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setErr('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${envConstant.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');

      if (!data.data.emailVerified) {
        // Store token in localStorage only — no cookie, so proxy still blocks /app
        localStorage.setItem('centlead_token', data.data.accessToken ?? '');
        try {
          const payload = JSON.parse(atob((data.data.accessToken ?? '').split('.')[1]));
          setUserEmail(payload.email ?? '');
        } catch { /* ignore */ }
        resend.start();
        setNeedsVerification(true);
      } else {
        applyToken(data.data.accessToken);
        setDone(true);
        setTimeout(() => router.replace('/app'), 1500);
      }
    } catch (e) {
      setErr((e as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      const token = localStorage.getItem('centlead_token');
      await fetch(`${envConstant.NEXT_PUBLIC_API_URL}/api/auth/send-verification-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      resend.start();
    } catch { /* silent */ } finally {
      setResending(false);
    }
  }

  if (needsVerification) return (
    <div style={CARD}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke="#4F46E5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 style={H1}>Password updated!</h1>
      <p style={SUB}>
        One more step — verify your email{userEmail ? <> at <strong style={{ color: '#0F172A' }}>{userEmail}</strong></> : ''} to access your account.
      </p>
      <button
        type="button"
        onClick={handleResend}
        disabled={resend.active || resending}
        style={{
          background: resend.active ? '#F1F5F9' : '#fff',
          color: resend.active ? '#94A3B8' : '#4F46E5',
          border: `1.5px solid ${resend.active ? '#E2E8F0' : '#4F46E5'}`,
          borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700,
          cursor: resend.active ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
        }}
      >
        {resending ? 'Sending…' : resend.active ? `Resend in ${resend.countdown}s` : 'Resend verification email'}
      </button>
    </div>
  );

  if (done) return (
    <div style={CARD}>
      <SuccessIcon />
      <h1 style={H1}>Password updated!</h1>
      <p style={SUB}>Taking you to the dashboard…</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ ...CARD, alignItems: 'stretch' }}>
      <div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#4F46E5" strokeWidth="1.75"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#4F46E5" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={H1}>Choose a new password.</h1>
        <p style={SUB}>Must be at least 8 characters.</p>
      </div>

      <div>
        <label style={LABEL}>New password</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            autoFocus
            className="auth-input"
            style={{ paddingRight: 48 }}
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label style={LABEL}>Confirm password</label>
        <input
          type={showPw ? 'text' : 'password'}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Same password again"
          required
          className={`auth-input${err.includes('match') ? ' error' : ''}`}
        />
      </div>

      {err && <p style={{ fontSize: 13, color: '#EF4444', margin: 0, fontWeight: 500 }}>{err}</p>}

      <button type="submit" disabled={loading} className="auth-primary-btn">
        {loading && <Spinner />}
        Set new password →
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Suspense>
          <ResetPasswordInner />
        </Suspense>
      </div>
    </div>
  );
}

const CARD: React.CSSProperties = { background: '#fff', borderRadius: 16, padding: '48px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 20 };
const H1: React.CSSProperties = { fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' };
const SUB: React.CSSProperties = { fontSize: 14, color: '#64748B', margin: '6px 0 0', lineHeight: 1.6 };
const LABEL: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} style={{ background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{children}</button>;
}
function SuccessIcon() {
  return <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
}
function ErrorIcon() {
  return <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="1.75"/><path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round"/></svg></div>;
}
