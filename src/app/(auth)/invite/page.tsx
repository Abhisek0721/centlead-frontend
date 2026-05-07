'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import { useAuth } from '@providers/AuthProvider';
interface InvitePreview {
  workspaceName: string;
  role: string;
  email: string;
  userExists?: boolean;
}

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
};

export default function InvitePage() {
  return (
    <Suspense>
      <InviteContent />
    </Suspense>
  );
}

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn, loading: authLoading } = useAuth();

  function clearStaleCookie() {
    document.cookie = 'auth_token=; path=/; max-age=0';
  }

  const token = searchParams.get('token') ?? '';

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!token) { setError('Invalid invite link.'); return; }

    axiosInstance.get(API_ROUTES.INVITE.PREVIEW(token))
      .then(async (res) => {
        const data = res.data.data as InvitePreview;
        const emailCheck = await axiosInstance.get(API_ROUTES.AUTH.CHECK_EMAIL(data.email));
        setPreview({ ...data, userExists: emailCheck.data.data.exists });
      })
      .catch((err) => setError(err?.response?.data?.message ?? 'Invitation not found or has expired.'));
  }, [token]);

  useEffect(() => {
    if (!preview || authLoading || !isSignedIn) return;

    // Auth is settled and user is signed in — auto-accept
    setAccepting(true);
    axiosInstance.post(API_ROUTES.INVITE.ACCEPT, { token })
      .then(() => router.replace('/app'))
      .catch((err) => {
        setAccepting(false);
        setError(err?.response?.data?.message ?? 'Failed to accept invitation.');
      });
  }, [preview, authLoading, isSignedIn, token, router]);

  if (!token || error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>
          Invalid invitation
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
          {error || 'This invite link is invalid.'}
        </p>
        <button
          onClick={() => router.push('/login')}
          className="auth-primary-btn"
          style={{ marginTop: 4 }}
        >
          Go to sign in
        </button>
      </div>
    );
  }

  if (!preview || accepting || authLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '16px 0' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E0E7FF', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>
          {accepting ? 'Joining workspace…' : 'Loading invitation…'}
        </p>
      </div>
    );
  }

  // Not logged in — show invite card
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#4F46E5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          You&apos;re invited to join
        </h1>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#4F46E5', margin: '4px 0 0', letterSpacing: '-0.3px' }}>
          {preview.workspaceName}
        </p>
      </div>

      <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Row label="Role" value={ROLE_LABEL[preview.role] ?? preview.role} capitalize />
        <Row label="Invited email" value={preview.email} />
      </div>

      <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
        {preview.userExists
          ? <>Sign in as <strong style={{ color: '#0F172A' }}>{preview.email}</strong> to accept this invitation.</>
          : <>Create a free account with <strong style={{ color: '#0F172A' }}>{preview.email}</strong> to accept this invitation.</>
        }
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {preview.userExists ? (
          <button onClick={() => { clearStaleCookie(); router.push(`/login?invite=${token}`); }} className="auth-primary-btn">
            Sign in to accept →
          </button>
        ) : (
          <button onClick={() => { clearStaleCookie(); router.push(`/signup?invite=${token}`); }} className="auth-primary-btn">
            Create account to accept →
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, capitalize = false }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 700, textTransform: capitalize ? 'capitalize' : 'none' }}>{value}</span>
    </div>
  );
}
