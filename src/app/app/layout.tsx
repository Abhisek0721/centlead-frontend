'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Layout } from 'antd';
import Sidebar from '@components/layout/Sidebar';
import TopNav from '@components/layout/TopNav';
import { WorkspaceProvider } from '@providers/WorkspaceProvider';
import { API_ROUTES } from '@constants/apiRoutes';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = localStorage.getItem('centlead_token');
      const res = await fetch(API_ROUTES.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data && data.data?.emailVerified === false) {
      localStorage.removeItem('centlead_token');
      document.cookie = 'auth_token=; path=/; max-age=0';
      router.replace('/login');
    }
  }, [data, router]);

  return (
    <WorkspaceProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <TopNav />
          <Layout.Content style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </WorkspaceProvider>
  );
}
