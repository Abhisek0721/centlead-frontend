'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@providers/AuthProvider';
import envConstant from '@constants/envConstant';

type Step = 'form' | 'verify';

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
          style={rightEl ? { paddingRight: 52 } : undefined}
        />
        {rightEl && (
          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
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

function PrimaryBtn({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading} className="auth-primary-btn">
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return <p style={{ fontSize: 13, color: '#EF4444', margin: '-6px 0 0', fontWeight: 500 }}>{msg}</p>;
}

// ── Main component ───────────────────────────────────────────────────────────

const FORM: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 20 };

function useResendCooldown() {
  const [countdown, setCountdown] = useState(60);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    setCountdown(60);
    if (timer.current) clearInterval(timer.current);
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

export default function SignUpForm() {
  const { signup } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const resend = useResendCooldown();

  function clrErr() { setErr(''); }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    clrErr();
    setLoading(true);
    try {
      await signup({ email, password, firstName: firstName || undefined, lastName: lastName || undefined });
      // Send verification email then show verify step
      const token = localStorage.getItem('centlead_token');
      if (token) {
        await fetch(`${envConstant.NEXT_PUBLIC_API_URL}/api/auth/send-verification-email`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      resend.start();
      setStep('verify');
    } catch (e) {
      setErr((e as Error).message || 'Something went wrong');
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

  function handleGoogle() {
    window.location.href = `${envConstant.NEXT_PUBLIC_API_URL}/api/auth/google`;
  }

  // ── Email verification step ──────────────────────────────────────
  if (step === 'verify') return (
    <div style={FORM}>
      <div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke="#4F46E5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Check your email.</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: '6px 0 0', lineHeight: 1.6 }}>
          We sent a verification link to <strong style={{ color: '#0F172A' }}>{email}</strong>.{' '}
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
      <p style={{ textAlign: 'center', fontSize: 13, color: '#64748B', margin: 0 }}>
        Wrong email?{' '}
        <button type="button" onClick={() => { setStep('form'); clrErr(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4F46E5', fontWeight: 700, padding: 0, fontSize: 13 }}>
          Go back
        </button>

      </p>
    </div>
  );

  // ── Sign up form ─────────────────────────────────────────────────
  return (
    <form onSubmit={handleSignUp} style={FORM}>
      <div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Get started free.</h1>
        <p style={{ fontSize: 15, color: '#64748B', margin: '8px 0 0', fontWeight: 500 }}>
          Create your workspace.{' '}
          <Link href="/login" style={{ color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}>Already have an account? Sign in →</Link>
        </p>
      </div>

      <button type="button" onClick={handleGoogle} className="auth-social-btn">
        <GoogleIcon /> Continue with Google
      </button>

      <Divider />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="First name" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Alex" />
        <Field label="Last name" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" />
      </div>

      <Field label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />

      <Field label="Password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters"
        rightEl={
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      {err && <ErrorMsg msg={err} />}
      <PrimaryBtn loading={loading}>Create account →</PrimaryBtn>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', margin: 0 }}>
        By signing up you agree to our{' '}
        <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Terms</a> and{' '}
        <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</a>.
      </p>
    </form>
  );
}
