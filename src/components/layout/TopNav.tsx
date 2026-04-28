'use client';

import { Layout, Space, Tag, Dropdown } from 'antd';
import {
  ThunderboltOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
  CheckOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useTheme } from '@providers/ThemeProvider';
import { useAuth } from '@providers/AuthProvider';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

const PLAN_COLOR: Record<string, string> = {
  trial: 'orange',
  starter: 'blue',
  growth: 'geekblue',
  pro: 'purple',
  agency: 'magenta',
};

export default function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { workspaceId, workspace, workspaces, switchWorkspace, openCreateModal } = useWorkspaceContext();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const plan = workspace?.plan;
  const credits = workspace?.creditsRemaining;

  const wsInitial = (workspace?.name?.[0] ?? '?').toUpperCase();
  const wsColor = `hsl(${((workspace?.name?.charCodeAt(0) ?? 0) * 37) % 360}, 55%, 48%)`;

  const wsDropdownItems = [
    ...workspaces.map((w) => ({
      key: w.id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: `hsl(${((w.name?.charCodeAt(0) ?? 0) * 37) % 360}, 55%, 48%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {w.name?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: w.id === workspaceId ? 600 : 400, flex: 1 }}>
            {w.name}
          </span>
          {w.id === workspaceId && (
            <CheckOutlined style={{ color: 'var(--brand)', fontSize: 11 }} />
          )}
        </div>
      ),
      onClick: () => switchWorkspace(w.id),
    })),
    { type: 'divider' as const },
    {
      key: '__new__',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand)', fontWeight: 600, fontSize: 13 }}>
          <PlusOutlined />
          New workspace
        </div>
      ),
      onClick: openCreateModal,
    },
  ];

  const userMenuItems = [
    {
      key: 'info',
      label: (
        <div style={{ padding: '2px 0', lineHeight: 1.4 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted, #9CA3AF)', marginBottom: 3, fontWeight: 500 }}>
            Signed in as
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-primary)',
              maxWidth: 180,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.email}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' as const },
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => router.push('/app/profile'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      label: 'Sign out',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        padding: '0 20px',
        height: 56,
        lineHeight: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left: Workspace switcher */}
      {workspaces.length > 0 && (
        <Dropdown menu={{ items: wsDropdownItems }} trigger={['click']} placement="bottomLeft">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '0 8px',
              height: 32,
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.15s',
              maxWidth: 200,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                background: wsColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {wsInitial}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                lineHeight: 'normal',
              }}
            >
              {workspace?.name ?? '—'}
            </span>
            <DownOutlined style={{ fontSize: 9, color: '#9CA3AF', flexShrink: 0 }} />
          </div>
        </Dropdown>
      )}

      {/* Right: credits, theme, user */}
      <Space size={8}>
        {plan && plan !== 'free' && (
          <Tag
            color={PLAN_COLOR[plan] ?? 'blue'}
            style={{ textTransform: 'capitalize', margin: 0, fontWeight: 600 }}
          >
            {plan}
          </Tag>
        )}

        {credits !== undefined && (
          <Space size={4} style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            <ThunderboltOutlined style={{ color: 'var(--brand)' }} />
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {credits.toLocaleString()}
              </strong>{' '}
              credits
            </span>
          </Space>
        )}

        <button
          onClick={toggleTheme}
          style={{
            padding: '6px 8px',
            borderRadius: 8,
            background: 'transparent',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            fontSize: 14,
            transition: 'all 0.2s',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
        </button>

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user?.email?.[0]?.toUpperCase() ?? <UserOutlined />}
          </button>
        </Dropdown>
      </Space>
    </Header>
  );
}
