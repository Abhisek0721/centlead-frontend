'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Layout, Tag } from 'antd';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CreditCardOutlined,
  SettingOutlined,
  ContactsOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useAuth } from '@providers/AuthProvider';

const { Sider } = Layout;

const NAV_ITEMS = [
  { key: '/app', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/app/jobs', icon: <ThunderboltOutlined />, label: 'Jobs' },
  { key: '/app/leads', icon: <ContactsOutlined />, label: 'Leads' },
  null,
  { key: '/app/team', icon: <TeamOutlined />, label: 'Team' },
  { key: '/app/billing', icon: <CreditCardOutlined />, label: 'Billing' },
  { key: '/app/settings', icon: <SettingOutlined />, label: 'Settings' },
];

function NavItem({
  navKey,
  icon,
  label,
  active,
  onClick,
}: {
  navKey: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '7px 10px',
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        color: active ? 'var(--brand)' : 'var(--text-secondary)',
        background: active ? 'var(--brand-light)' : 'transparent',
        marginBottom: 1,
        transition: 'background 0.15s, color 0.15s',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)';
          (e.currentTarget as HTMLDivElement).style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLDivElement).style.background = 'transparent';
          (e.currentTarget as HTMLDivElement).style.color = 'var(--text-secondary)';
        }
      }}
    >
      <span style={{ fontSize: 15, display: 'flex', alignItems: 'center', flexShrink: 0, width: 16 }}>
        {icon}
      </span>
      {label}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { workspace } = useWorkspaceContext();
  const { user } = useAuth();

  const allNavItems = NAV_ITEMS.filter((i): i is NonNullable<typeof i> => i !== null);
  const selectedKey =
    allNavItems
      .slice()
      .reverse()
      .find((item) => pathname.startsWith(item.key))?.key ?? '/app';

  const creditsRemaining = workspace?.creditsRemaining ?? 0;
  const monthlyCredits = workspace?.monthlyCredits ?? 1;
  const usedPct = Math.round(((monthlyCredits - creditsRemaining) / monthlyCredits) * 100);
  const barColor = usedPct > 80 ? '#EF4444' : usedPct > 50 ? '#F59E0B' : 'var(--brand)';

  return (
    <Sider
      width={220}
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid var(--border)',
        background: 'var(--bg-base)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Logo */}
        <div
          style={{
            padding: '18px 16px 16px',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/app')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ThunderboltFilled style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Centlead
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item, i) =>
            item === null ? (
              <div
                key={`divider-${i}`}
                style={{ height: 1, background: 'var(--border)', margin: '6px 2px' }}
              />
            ) : (
              <NavItem
                key={item.key}
                navKey={item.key}
                icon={item.icon}
                label={item.label}
                active={selectedKey === item.key}
                onClick={() => router.push(item.key)}
              />
            )
          )}
        </nav>

        {/* Credits mini-bar */}
        {workspace && (
          <>
            <div style={{ height: 1, background: 'var(--border)', margin: '0 14px' }} />
            <div style={{ padding: '11px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ThunderboltFilled style={{ color: 'var(--brand)', fontSize: 11 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {creditsRemaining.toLocaleString()} credits
                  </span>
                </div>
                <Tag
                  style={{
                    fontSize: 10,
                    padding: '0 6px',
                    lineHeight: '18px',
                    margin: 0,
                    borderRadius: 10,
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    background: 'var(--brand-light)',
                    color: 'var(--brand)',
                    border: '1px solid var(--brand-border)',
                  }}
                >
                  {workspace.plan}
                </Tag>
              </div>
              <div style={{ height: 4, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${usedPct}%`,
                    borderRadius: 4,
                    background: barColor,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {(monthlyCredits - creditsRemaining).toLocaleString()} of {monthlyCredits.toLocaleString()} used
              </div>
            </div>
          </>
        )}

        {/* User section */}
        <div style={{ height: 1, background: 'var(--border)', margin: '0 14px' }} />
        <div style={{ padding: '11px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.email}
              </div>
              {user?.firstName && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </Sider>
  );
}
