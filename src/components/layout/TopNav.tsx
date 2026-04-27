'use client';

import { useState, useRef, useEffect } from 'react';
import { Layout, Space, Tag } from 'antd';
import { ThunderboltOutlined, SunOutlined, MoonOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useTheme } from '@providers/ThemeProvider';
import { useAuth } from '@providers/AuthProvider';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

interface TopNavProps {
  creditsRemaining?: number;
  plan?: string;
}

export default function TopNav({ creditsRemaining, plan }: TopNavProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <Header
      style={{
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 16,
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Space size={8}>
        {plan && plan !== 'free' && (
          <Tag
            color={plan === 'trial' ? 'orange' : 'blue'}
            style={{ textTransform: 'capitalize', margin: 0 }}
          >
            {plan}
          </Tag>
        )}

        {creditsRemaining !== undefined && (
          <Space size={4} style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            <ThunderboltOutlined style={{ color: '#4F46E5' }} />
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {creditsRemaining.toLocaleString()}
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

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#4F46E5',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
            }}
          >
            <UserOutlined />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 40,
              background: 'var(--bg-elevated, #fff)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              minWidth: 200,
              padding: '8px 0',
              zIndex: 100,
            }}>
              <div style={{ padding: '8px 14px 10px', borderBottom: '1px solid var(--border)' }}>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Signed in as</p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#EF4444',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                <LogoutOutlined /> Sign out
              </button>
            </div>
          )}
        </div>
      </Space>
    </Header>
  );
}
