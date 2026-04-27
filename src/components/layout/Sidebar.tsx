'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CreditCardOutlined,
  SettingOutlined,
  ContactsOutlined,
} from '@ant-design/icons';
import { useTheme } from '@providers/ThemeProvider';

const { Sider } = Layout;

const NAV_ITEMS = [
  { key: '/app', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/app/jobs', icon: <ThunderboltOutlined />, label: 'Jobs' },
  { key: '/app/leads', icon: <ContactsOutlined />, label: 'Leads' },
  { key: '/app/team', icon: <TeamOutlined />, label: 'Team' },
  { key: '/app/billing', icon: <CreditCardOutlined />, label: 'Billing' },
  { key: '/app/settings', icon: <SettingOutlined />, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const selectedKey =
    NAV_ITEMS.slice()
      .reverse()
      .find((item) => pathname.startsWith(item.key))?.key ?? '/app';

  return (
    <Sider
      width={220}
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          padding: '20px 16px 12px',
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Centlead
      </div>

      <Menu
        theme={theme === 'dark' ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[selectedKey]}
        items={NAV_ITEMS}
        onClick={({ key }) => router.push(key)}
        style={{ border: 'none', background: 'transparent' }}
      />
    </Sider>
  );
}
