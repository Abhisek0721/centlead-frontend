'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@providers/AuthProvider';
import envConstant from '@constants/envConstant';

type Step = 'login' | 'verify' | 'forgot_email' | 'forgot_sent';

// ── Shared primitives ────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 13.251 17.64 10.943 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  rightEl?: React.ReactNode;
  maxLength?: number;
  hasError?: boolean;
  autoFocus?: boolean;
}

function Field({ label, type = 'text', value, onChange, placeholder, rightEl, maxLength, hasError, autoFocus }: FieldProps) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          required
          className={`auth-input${hasError ? ' error' : ''}`}
          style={rightEl ? { paddingRight: 104 } : undefined}
        />
        {rightEl && (
          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {rightEl}
          </div>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>or</span>
      <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
    </div>
  );
}

function PrimaryBtn({ loading, children, disabled }: { loading: boolean; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="submit" disabled={loading || disabled} className="auth-primary-btn">
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return <p style={{ fontSize: 13, color: '#EF4444', margin: '-6px 0 0', fontWeight: 500 }}>{msg}</p>;
}

function useResendCooldown(initialActive = false) {
  const [countdown, setCountdown] = useState(initialActive ? 60 : 0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    setCountdown(60);
    timer.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer.current!); return 0; }
        return c - 1;
      });
    }, 1000);
  }

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return { countdown, start, active: countdown > 0 };
}

// ── Main component ───────────────────────────────────────────────────────────

const FORM: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 20 };

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');

  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const resend = useResendCooldown(false);

  function clrErr() { setErr(''); }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    clrErr();
    setLoading(true);
    try {
      await login(email, password);
      if (inviteToken) {
        try {
          await axiosInstance.post(API_ROUTES.INVITE.ACCEPT, { token: inviteToken });
        } catch {
          // Ignore — workspace might already be joined or token expired
        }
      }
      router.push('/app');
    } catch (e) {
      const msg = (e as Error).message || '';
      if (msg === 'EMAIL_NOT_VERIFIED') {
        resend.start();
        setStep('verify');
      } else {
        setErr(msg || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    clrErr();
    try {
      await fetch(`${envConstant.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      resend.start();
    } catch {
      setErr('Failed to resend. Try again.');
    } finally {
      setResending(false);
    }
  }

  async function handleSendReset(e: React.FormEvent) {
    e.preventDefault();
    clrErr();
    setLoading(true);
    try {
      const res = await fetch(`${envConstant.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reset email');
      setStep('forgot_sent');
    } catch (e) {
      setErr((e as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogle() {
    window.location.href = `${envConstant.NEXT_PUBLIC_API_URL}/api/auth/google`;
  }

  // ── Email verification step (after blocked login) ────────────────
  if (step === 'verify') return (
    <div style={FORM}>
      <div>
        <button type="button" onClick={() => { setStep('login'); clrErr(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13, fontWeight: 600, padding: '0 0 20px' }}>
          <ArrowLeft size={14} /> Back to sign in
        </button>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke="#4F46E5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Check your email.</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: '8px 0 0', lineHeight: 1.6 }}>
          We sent a verification link to{' '}
          <strong style={{ color: '#0F172A' }}>{email}</strong>.{' '}
          Click the link to verify your account.
        </p>
      </div>
      {err && <ErrorMsg msg={err} />}
      <button
        type="button"
        onClick={handleResend}
        disabled={resend.active || resending}
        style={{
          background: resend.active ? '#F1F5F9' : '#fff',
          color: resend.active ? '#94A3B8' : '#4F46E5',
          border: `1.5px solid ${resend.active ? '#E2E8F0' : '#4F46E5'}`,
          borderRadius: 10,
          padding: '12px 0',
          fontSize: 14,
          fontWeight: 700,
          cursor: resend.active ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {resending ? 'Sending…' : resend.active ? `Resend in ${resend.countdown}s` : 'Resend verification email'}
      </button>
    </div>
  );

  // ── Reset: enter email ───────────────────────────────────────────
  if (step === 'forgot_email') return (
    <form onSubmit={handleSendReset} style={FORM}>
      <div>
        <button type="button" onClick={() => { setStep('login'); clrErr(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13, fontWeight: 600, padding: '0 0 20px' }}>
          <ArrowLeft size={14} /> Back to sign in
        </button>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Reset password.</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: '6px 0 0' }}>We'll send a reset link to your email.</p>
      </div>
      <Field label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" hasError={!!err} autoFocus />
      {err && <ErrorMsg msg={err} />}
      <PrimaryBtn loading={loading}>Send reset link →</PrimaryBtn>
    </form>
  );

  // ── Reset: confirmation ──────────────────────────────────────────
  if (step === 'forgot_sent') return (
    <div style={FORM}>
      <div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke="#4F46E5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Check your email.</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: '6px 0 0' }}>
          We sent a reset link to <strong style={{ color: '#0F172A' }}>{email}</strong>
        </p>
      </div>
      <button type="button" onClick={() => { setStep('login'); clrErr(); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4F46E5', fontSize: 13, fontWeight: 700, padding: 0, textAlign: 'left' }}>
        ← Back to sign in
      </button>
    </div>
  );

  // ── Normal sign in ───────────────────────────────────────────────
  return (
    <form onSubmit={handleLogin} style={FORM}>
      <div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Welcome back.</h1>
        <p style={{ fontSize: 15, color: '#64748B', margin: '8px 0 0', fontWeight: 500 }}>
          Sign in to continue.{' '}
          <Link href="/signup" style={{ color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}>No account? Sign up →</Link>
        </p>
      </div>

      <button type="button" onClick={handleGoogle} className="auth-social-btn">
        <GoogleIcon /> Continue with Google
      </button>

      <Divider />

      <Field label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />

      <Field label="Password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
        rightEl={
          <>
            <button type="button" onClick={() => { setStep('forgot_email'); clrErr(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4F46E5', fontSize: 12, fontWeight: 700, padding: 0, whiteSpace: 'nowrap' }}>
              Forgot?
            </button>
            <button type="button" onClick={() => setShowPw(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </>
        }
      />

      {err && <ErrorMsg msg={err} />}
      <PrimaryBtn loading={loading}>Sign in →</PrimaryBtn>
    </form>
  );
}
