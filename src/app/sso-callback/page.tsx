'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '@utils/localStorage';

function SSOCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      router.replace('/login?error=google_auth_failed');
      return;
    }

    setToken(token);
    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    router.replace('/app');
  }, [searchParams, router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#64748B', fontSize: 14 }}>Signing you in…</p>
    </div>
  );
}

export default function SSOCallbackPage() {
  return (
    <Suspense>
      <SSOCallbackInner />
    </Suspense>
  );
}
