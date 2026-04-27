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
      colorPrimary: '#4F46E5',
      colorBgBase: dark ? '#0D0F1A' : '#FFFFFF',
      colorBgContainer: dark ? '#12141F' : '#FFFFFF',
      colorBgElevated: dark ? '#1A1D2E' : '#FFFFFF',
      borderRadius: 10,
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    },
    components: {
      Layout: {
        siderBg: dark ? '#0D0F1A' : '#FFFFFF',
        headerBg: dark ? '#12141F' : '#FFFFFF',
        bodyBg: dark ? '#0D0F1A' : '#F8F9FF',
      },
      Menu: {
        darkItemBg: '#0D0F1A',
        darkSubMenuItemBg: '#0D0F1A',
        itemBg: 'transparent',
        subMenuItemBg: 'transparent',
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
