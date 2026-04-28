'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme as antTheme } from 'antd';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@lib/queryClient';
import { ThemeProvider, useTheme } from '@providers/ThemeProvider';
import { AuthProvider } from '@providers/AuthProvider';

function AntdThemedProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const antdConfig = {
    algorithm: dark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: dark ? '#6366F1' : '#4F46E5',
      colorBgBase: dark ? '#09090F' : '#FAFAFA',
      colorBgContainer: dark ? '#111118' : '#FFFFFF',
      colorBgElevated: dark ? '#18181F' : '#FFFFFF',
      colorBorder: dark ? '#1C1C26' : '#E5E7EB',
      colorText: dark ? '#F1F5F9' : '#0F172A',
      colorTextSecondary: dark ? '#94A3B8' : '#64748B',
      borderRadius: 10,
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    },
    components: {
      Layout: {
        siderBg: dark ? '#09090F' : '#FFFFFF',
        headerBg: dark ? '#111118' : '#FFFFFF',
        bodyBg: dark ? '#09090F' : '#FAFAFA',
      },
      Menu: {
        darkItemBg: '#09090F',
        darkSubMenuItemBg: '#09090F',
        itemBg: 'transparent',
        subMenuItemBg: 'transparent',
      },
      Card: {
        colorBgContainer: dark ? '#111118' : '#FFFFFF',
      },
      Table: {
        colorBgContainer: dark ? '#111118' : '#FFFFFF',
        headerBg: dark ? '#18181F' : '#FAFAFA',
      },
    },
  };

  return (
    <ConfigProvider theme={antdConfig}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: dark ? '#1A1D2E' : '#FFFFFF',
            color: dark ? '#F9FAFB' : '#111827',
            border: `1px solid ${dark ? '#1E2133' : '#E5E7EB'}`,
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            fontSize: '14px',
          },
        }}
      />
    </ConfigProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AntdRegistry>
            <AntdThemedProvider>{children}</AntdThemedProvider>
          </AntdRegistry>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
