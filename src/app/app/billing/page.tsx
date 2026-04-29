'use client';

import { useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Button, Skeleton } from 'antd';
import {
  ThunderboltOutlined,
  CheckOutlined,
  RiseOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useBillingPlans } from '@hooks/useBilling';
import { useCreditBalance, useCreditTransactions } from '@hooks/useCredits';
import type { CreditTransaction, BillingPlan } from '@appTypes/index';

const PLAN_ORDER = ['starter', 'growth', 'pro', 'agency'];

const PLAN_HIGHLIGHT: Record<string, string> = {
  starter: '#3B82F6',
  growth: '#4F46E5',
  pro: '#7C3AED',
  agency: '#EC4899',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BillingPage() {
  const router = useRouter();
  const { workspaceId, workspace, currentRole, isLoading } = useWorkspaceContext();
  const isAdminOrOwner = currentRole === 'owner' || currentRole === 'admin';

  useEffect(() => {
    if (!isLoading && currentRole && !isAdminOrOwner) {
      router.replace('/app');
    }
  }, [isLoading, currentRole, isAdminOrOwner, router]);
  const { data: balance } = useCreditBalance(workspaceId);
  const { data: txData, isLoading: txLoading } = useCreditTransactions(workspaceId, { limit: 20 });
  const { data: plans = [], isLoading: plansLoading } = useBillingPlans();

  const monthlyCredits = balance?.monthlyCredits ?? workspace?.monthlyCredits ?? 0;
  const creditsRemaining = balance?.creditsRemaining ?? workspace?.creditsRemaining ?? 0;
  const creditsUsed = monthlyCredits - creditsRemaining;
  const creditPct = monthlyCredits
    ? Math.round((creditsRemaining / monthlyCredits) * 100)
    : 0;

  const trialDaysLeft = workspace?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(workspace.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;

  const currentPlan = balance?.plan ?? workspace?.plan ?? 'free';

  const txColumns = [
    {
      title: 'Description',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string, record: CreditTransaction) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: record.amount > 0 ? '#D1FAE5' : '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {record.amount > 0 ? (
              <PlusOutlined style={{ color: '#10B981', fontSize: 12 }} />
            ) : (
              <MinusOutlined style={{ color: '#EF4444', fontSize: 12 }} />
            )}
          </div>
          <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{reason}</span>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <span
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: amount > 0 ? '#10B981' : '#EF4444',
          }}
        >
          {amount > 0 ? '+' : ''}{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (d: string) => (
        <span style={{ fontSize: 13, color: '#6B7280' }}>{formatDate(d)}</span>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.4px',
          }}
        >
          Billing &amp; Credits
        </h1>
        <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: 14 }}>
          Manage your plan and track credit usage.
        </p>
      </div>

      {/* Current plan + credits */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>
              Current Plan
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: PLAN_HIGHLIGHT[currentPlan] ?? 'var(--text-primary)',
                  textTransform: 'capitalize',
                  letterSpacing: '-0.5px',
                }}
              >
                {currentPlan === 'free' ? 'Free' : currentPlan === 'trial' ? 'Trial' : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </span>
              {currentPlan === 'trial' && trialDaysLeft !== null && (
                <Tag color={trialDaysLeft > 3 ? 'orange' : 'red'}>
                  {trialDaysLeft > 0 ? `${trialDaysLeft}d left` : 'Expired'}
                </Tag>
              )}
            </div>
            {(currentPlan === 'trial' || currentPlan === 'free') && (
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 14px' }}>
                Upgrade to a paid plan to unlock unlimited jobs, more credits, and team features.
              </p>
            )}
            <Button type="primary" icon={<RiseOutlined />} style={{ fontWeight: 600 }}>
              Upgrade Plan
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>
              Credits
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
              <ThunderboltOutlined style={{ color: 'var(--brand)', fontSize: 18 }} />
              <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand)' }}>
                {creditsRemaining.toLocaleString()}
              </span>
              <span style={{ fontSize: 14, color: '#9CA3AF' }}>remaining</span>
            </div>
            {/* Usage bar: starts empty, fills as credits are consumed */}
            <div
              style={{
                height: 6,
                borderRadius: 4,
                background: 'var(--border)',
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${100 - creditPct}%`,
                  borderRadius: 4,
                  background:
                    (100 - creditPct) > 80 ? '#EF4444' :
                    (100 - creditPct) > 50 ? '#F59E0B' : 'var(--brand)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              {creditsUsed.toLocaleString()} of {monthlyCredits.toLocaleString()} used this period
            </span>
          </Card>
        </Col>
      </Row>

      {/* Plan cards */}
      <Card
        variant="borderless"
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}
        title={<span style={{ fontWeight: 700 }}>Available Plans</span>}
      >
        {plansLoading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <Row gutter={[16, 16]}>
            {(plans.length > 0 ? plans : [
              {
                id: 'starter',
                name: 'Starter',
                price: 29,
                credits: 2000,
                features: ['2,000 credits / month', 'Lead generation', 'Lead scoring', 'Export leads', '1 workspace'],
              },
              {
                id: 'growth',
                name: 'Growth',
                price: 79,
                credits: 8000,
                features: ['8,000 credits / month', 'Advanced scoring', 'Website analysis', 'Lead exports', 'Priority processing'],
              },
              {
                id: 'pro',
                name: 'Pro',
                price: 149,
                credits: 25000,
                features: ['25,000 credits / month', 'Team accounts', 'Advanced filters', 'Bulk jobs', 'All Growth features'],
              },
              {
                id: 'agency',
                name: 'Agency',
                price: 299,
                credits: 100000,
                features: ['100,000 credits / month', 'API access', 'Team collaboration', 'Priority processing', 'Dedicated support'],
              },
            ] as BillingPlan[]).map((plan: BillingPlan) => {
              const isCurrent = currentPlan === plan.id;
              const color = PLAN_HIGHLIGHT[plan.id] ?? '#4F46E5';
              return (
                <Col key={plan.id} xs={24} sm={12} lg={6}>
                  <div
                    style={{
                      border: isCurrent ? `2px solid ${color}` : '1.5px solid var(--border)',
                      borderRadius: 12,
                      padding: 20,
                      position: 'relative',
                      transition: 'box-shadow 0.2s',
                      background: isCurrent ? `${color}08` : 'var(--bg-elevated)',
                    }}
                  >
                    {isCurrent && (
                      <Tag
                        style={{
                          position: 'absolute',
                          top: -10,
                          left: 16,
                          color,
                          background: 'var(--bg-elevated)',
                          border: `1.5px solid ${color}`,
                          borderRadius: 20,
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        Current
                      </Tag>
                    )}
                    <div style={{ fontWeight: 800, fontSize: 16, color, marginBottom: 2 }}>
                      {plan.name}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>
                      ${plan.price}
                      <span style={{ fontSize: 14, fontWeight: 400, color: '#9CA3AF' }}>/mo</span>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: '#6B7280',
                        marginBottom: 14,
                        fontWeight: 500,
                      }}
                    >
                      {plan.credits.toLocaleString()} credits/mo
                    </div>
                    {plan.features?.map((f) => (
                      <div
                        key={f}
                        style={{
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                          marginBottom: 6,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 6,
                        }}
                      >
                        <CheckOutlined style={{ color: '#10B981', marginTop: 2, flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                    <Button
                      type={isCurrent ? 'default' : 'primary'}
                      block
                      disabled={isCurrent}
                      style={{
                        marginTop: 12,
                        fontWeight: 600,
                        ...(isCurrent ? {} : { background: color, borderColor: color }),
                      }}
                    >
                      {isCurrent ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </Card>

      {/* Transaction history */}
      <Card
        variant="borderless"
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        title={<span style={{ fontWeight: 700 }}>Credit History</span>}
      >
        {txLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (txData?.transactions ?? []).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#9CA3AF' }}>
            No credit transactions yet.
          </div>
        ) : (
          <Table
            dataSource={txData?.transactions ?? []}
            columns={txColumns}
            rowKey="id"
            size="small"
            pagination={{
              pageSize: 20,
              total: txData?.totalCount ?? 0,
              showTotal: (total) => `${total} transactions`,
              showSizeChanger: false,
            }}
          />
        )}
      </Card>
    </div>
  );
}
