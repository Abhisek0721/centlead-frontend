'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import envConstant from '@constants/envConstant';

function applyToken(token: string) {
  localStorage.setItem('centlead_token', token);
  document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the link.');
      return;
    }

    fetch(`${envConstant.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Verification failed');
        applyToken(data.data.accessToken);
        setStatus('success');
        setTimeout(() => router.replace('/app'), 1500);
      })
      .catch((e: Error) => {
        setStatus('error');
        setMessage(e.message || 'Verification failed');
      });
  }, [searchParams, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        textAlign: 'center',
      }}>
        {status === 'loading' && (
          <>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke="#4F46E5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Verifying your email…</h1>
            <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>You're verified!</h1>
            <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Taking you to the dashboard…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="1.75"/>
                <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Link invalid or expired</h1>
            <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 24px' }}>{message}</p>
            <button
              onClick={() => router.replace('/login')}
              style={{ background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailInner />
    </Suspense>
  );
}
