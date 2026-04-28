'use client';

import { Row, Col, Card, Table, Tag, Button, Skeleton, Empty } from 'antd';
import {
  ThunderboltOutlined,
  PlusOutlined,
  RightOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useJobs } from '@hooks/useJobs';
import type { Job, JobStatus } from '@appTypes/index';

const STATUS_CONFIG: Record<JobStatus, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: '#6B7280', icon: <ClockCircleOutlined />, label: 'Pending' },
  running: { color: '#3B82F6', icon: <SyncOutlined spin />, label: 'Running' },
  completed: { color: '#10B981', icon: <CheckCircleOutlined />, label: 'Completed' },
  failed: { color: '#EF4444', icon: <ExclamationCircleOutlined />, label: 'Failed' },
};

function StatusTag({ status }: { status: JobStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Tag
      icon={cfg.icon}
      style={{
        color: cfg.color,
        background: `${cfg.color}15`,
        border: `1px solid ${cfg.color}30`,
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      {cfg.label}
    </Tag>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export default function DashboardPage() {
  const router = useRouter();
  const { workspace, workspaceId, isLoading: wsLoading } = useWorkspaceContext();
  const { data: jobsData, isLoading: jobsLoading } = useJobs(workspaceId, { limit: 5, pageNumber: 1 });

  const jobs = jobsData?.jobs ?? [];
  const totalJobs = jobsData?.totalCount ?? 0;
  const runningJobs = jobs.filter((j) => j.status === 'running').length;
  const totalLeads = jobs.reduce((sum, j) => sum + (j._count?.leads ?? 0), 0);

  const trialDaysLeft = workspace?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(workspace.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;

  const creditPct = workspace
    ? Math.round((workspace.creditsRemaining / (workspace.monthlyCredits || 1)) * 100)
    : 0;

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s: JobStatus) => <StatusTag status={s} />,
    },
    {
      title: 'Search Query',
      dataIndex: 'searchQuery',
      key: 'searchQuery',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{text}</span>
      ),
    },
    {
      title: 'Leads',
      key: 'leads',
      width: 80,
      render: (_: unknown, record: Job) => (
        <span style={{ fontWeight: 700, color: '#4F46E5' }}>
          {record._count?.leads ?? 0}
        </span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (d: string) => (
        <span style={{ color: '#6B7280', fontSize: 13 }}>{timeAgo(d)}</span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_: unknown, record: Job) => (
        <Button
          type="text"
          size="small"
          icon={<RightOutlined />}
          onClick={() => router.push(`/app/jobs/${record.id}`)}
        />
      ),
    },
  ];

  if (wsLoading) {
    return (
      <div>
        <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 24 }} />
        <Row gutter={16}>
          {[1, 2, 3, 4].map((i) => (
            <Col key={i} xs={24} sm={12} lg={6}>
              <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            {workspace?.name ?? 'Dashboard'}
          </h1>
          <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 14 }}>
            {workspace?.plan === 'trial'
              ? trialDaysLeft !== null && trialDaysLeft > 0
                ? `Trial — ${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} remaining`
                : 'Trial expired'
              : workspace?.plan
              ? `${workspace.plan.charAt(0).toUpperCase()}${workspace.plan.slice(1)} plan`
              : 'Overview'}
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => router.push('/app/jobs')}
          style={{ fontWeight: 600 }}
        >
          New Job
        </Button>
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]} align="stretch" style={{ marginBottom: 24 }}>
        {[
          {
            label: 'Total Jobs',
            value: totalJobs,
            unit: 'jobs',
            color: 'var(--text-primary)',
          },
          {
            label: 'Running Now',
            value: runningJobs,
            unit: 'active',
            color: '#3B82F6',
          },
          {
            label: 'Leads Found',
            value: totalLeads,
            unit: 'leads',
            color: '#10B981',
          },
        ].map(({ label, value, unit, color }) => (
          <Col key={label} xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 10 }}>
                {label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>
                  {value.toLocaleString()}
                </span>
                <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>{unit}</span>
              </div>
            </Card>
          </Col>
        ))}

        {/* Credits card — same height, usage-first framing */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 10 }}>
              Credits
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#4F46E5', lineHeight: 1 }}>
                {(workspace?.creditsRemaining ?? 0).toLocaleString()}
              </span>
              <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>remaining</span>
            </div>
            {/* Usage bar: starts empty, fills as credits are consumed */}
            <div
              style={{
                height: 4,
                borderRadius: 4,
                background: '#E5E7EB',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${100 - creditPct}%`,
                  borderRadius: 4,
                  background: (100 - creditPct) > 80 ? '#EF4444' : (100 - creditPct) > 50 ? '#F59E0B' : '#4F46E5',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
              {((workspace?.monthlyCredits ?? 0) - (workspace?.creditsRemaining ?? 0)).toLocaleString()} of {(workspace?.monthlyCredits ?? 0).toLocaleString()} used
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Jobs */}
      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Recent Jobs</span>
            <Button
              type="link"
              size="small"
              onClick={() => router.push('/app/jobs')}
              style={{ fontWeight: 600, padding: 0 }}
            >
              View all →
            </Button>
          </div>
        }
      >
        {jobsLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : jobs.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No jobs yet. Create your first job to start finding leads."
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/app/jobs')}
            >
              Create Job
            </Button>
          </Empty>
        ) : (
          <Table
            dataSource={jobs}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="small"
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onClick: () => router.push(`/app/jobs/${record.id}`),
            })}
          />
        )}
      </Card>
    </div>
  );
}
