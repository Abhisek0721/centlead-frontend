'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Select } from 'antd';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CreditCardOutlined,
  SettingOutlined,
  ContactsOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useTheme } from '@providers/ThemeProvider';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';

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
  const { workspaceId, workspaces, switchWorkspace } = useWorkspaceContext();

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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '18px 16px 10px' }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 12,
          }}
        >
          Centlead
        </div>

        {workspaces.length > 0 && (
          <Select
            value={workspaceId}
            onChange={switchWorkspace}
            size="small"
            style={{ width: '100%' }}
            suffixIcon={<SwapOutlined style={{ fontSize: 10 }} />}
            options={workspaces.map((w) => ({ label: w.name, value: w.id }))}
            popupMatchSelectWidth={false}
          />
        )}
      </div>

      <Menu
        theme={theme === 'dark' ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[selectedKey]}
        items={NAV_ITEMS}
        onClick={({ key }) => router.push(key)}
        style={{ border: 'none', background: 'transparent', flex: 1 }}
      />
    </Sider>
  );
}
