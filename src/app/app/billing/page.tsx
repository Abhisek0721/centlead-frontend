'use client';

import { Row, Col, Card, Progress, Table, Tag, Button, Skeleton } from 'antd';
import {
  ThunderboltOutlined,
  CheckOutlined,
  RiseOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
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
  const { workspaceId, workspace } = useWorkspaceContext();
  const { data: balance } = useCreditBalance(workspaceId);
  const { data: txData, isLoading: txLoading } = useCreditTransactions(workspaceId, { limit: 20 });
  const { data: plans = [], isLoading: plansLoading } = useBillingPlans();

  const creditsUsed = (balance?.monthlyCredits ?? 0) - (balance?.creditsRemaining ?? 0);
  const creditPct = balance?.monthlyCredits
    ? Math.round((balance.creditsRemaining / balance.monthlyCredits) * 100)
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
            bordered={false}
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
                  color: PLAN_HIGHLIGHT[currentPlan] ?? '#374151',
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
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>
              Credits
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <ThunderboltOutlined style={{ color: '#4F46E5', fontSize: 18 }} />
              <span style={{ fontSize: 28, fontWeight: 900, color: '#4F46E5' }}>
                {(balance?.creditsRemaining ?? workspace?.creditsRemaining ?? 0).toLocaleString()}
              </span>
              <span style={{ fontSize: 14, color: '#9CA3AF' }}>
                / {(balance?.monthlyCredits ?? workspace?.monthlyCredits ?? 0).toLocaleString()} remaining
              </span>
            </div>
            <Progress
              percent={creditPct}
              showInfo={false}
              strokeColor={creditPct < 20 ? '#EF4444' : creditPct < 50 ? '#F59E0B' : '#4F46E5'}
              trailColor="#E5E7EB"
              style={{ marginBottom: 8 }}
            />
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              {creditsUsed.toLocaleString()} used this period
            </span>
          </Card>
        </Col>
      </Row>

      {/* Plan cards */}
      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}
        title={<span style={{ fontWeight: 700 }}>Available Plans</span>}
      >
        {plansLoading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <Row gutter={16}>
            {(plans.length > 0 ? plans : PLAN_ORDER.map((id) => ({
              id,
              name: id.charAt(0).toUpperCase() + id.slice(1),
              price: { starter: 29, growth: 79, pro: 149, agency: 299 }[id] ?? 0,
              credits: { starter: 2000, growth: 8000, pro: 25000, agency: 100000 }[id] ?? 0,
              features: [],
            }))).map((plan: BillingPlan) => {
              const isCurrent = currentPlan === plan.id;
              const color = PLAN_HIGHLIGHT[plan.id] ?? '#4F46E5';
              return (
                <Col key={plan.id} xs={24} sm={12} lg={6}>
                  <div
                    style={{
                      border: isCurrent ? `2px solid ${color}` : '1.5px solid #E5E7EB',
                      borderRadius: 12,
                      padding: 20,
                      position: 'relative',
                      transition: 'box-shadow 0.2s',
                      background: isCurrent ? `${color}08` : '#fff',
                    }}
                  >
                    {isCurrent && (
                      <Tag
                        style={{
                          position: 'absolute',
                          top: -10,
                          left: 16,
                          color,
                          background: '#fff',
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
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#111827', marginBottom: 4 }}>
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
                          color: '#374151',
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
        bordered={false}
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
