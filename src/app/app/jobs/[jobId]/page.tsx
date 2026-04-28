'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  Table,
  Tag,
  Button,
  Skeleton,
  Descriptions,
  Row,
  Col,
  Tooltip,
  Progress,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltFilled,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useJob } from '@hooks/useJobs';
import { useLeadsByJob } from '@hooks/useLeads';
import type { JobStatus, Lead } from '@appTypes/index';

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
        fontSize: 13,
        padding: '2px 10px',
      }}
    >
      {cfg.label}
    </Tag>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span style={{ color: '#9CA3AF' }}>—</span>;
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `${color}15`,
          border: `1.5px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 13,
          color,
        }}
      >
        {Math.round(score)}
      </div>
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const router = useRouter();
  const { workspaceId } = useWorkspaceContext();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: job, isLoading: jobLoading } = useJob(workspaceId, jobId);
  const { data: leadsData, isLoading: leadsLoading } = useLeadsByJob(workspaceId, jobId, {
    pageNumber: page,
    limit: pageSize,
  });

  const leads = leadsData?.leads ?? [];

  const columns = [
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 70,
      sorter: (a: Lead, b: Lead) => (a.score ?? 0) - (b.score ?? 0),
      defaultSortOrder: 'descend' as const,
      render: (score: number | null) => <ScoreBadge score={score} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{name}</span>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: unknown, record: Lead) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {record.email && (
            <a href={`mailto:${record.email}`} style={{ fontSize: 13, color: 'var(--brand)' }}>
              <MailOutlined style={{ marginRight: 4 }} />{record.email}
            </a>
          )}
          {record.phone && (
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              <PhoneOutlined style={{ marginRight: 4 }} />{record.phone}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      width: 180,
      render: (url: string | null) =>
        url ? (
          <a
            href={url.startsWith('http') ? url : `https://${url}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: 4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlobalOutlined />
            {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </a>
        ) : (
          <span style={{ color: '#9CA3AF' }}>—</span>
        ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (addr: string | null) =>
        addr ? (
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />{addr}
          </span>
        ) : (
          <span style={{ color: '#9CA3AF' }}>—</span>
        ),
    },
    {
      title: 'Why',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (reason: string | null) =>
        reason ? (
          <Tooltip title={reason}>
            <span style={{ fontSize: 13, color: '#6B7280', cursor: 'help' }}>
              {reason.length > 60 ? `${reason.slice(0, 60)}…` : reason}
            </span>
          </Tooltip>
        ) : (
          <span style={{ color: '#9CA3AF' }}>—</span>
        ),
    },
  ];

  if (jobLoading) {
    return (
      <div style={{ maxWidth: 1100 }}>
        <Skeleton active paragraph={{ rows: 4 }} style={{ marginBottom: 24 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ color: '#6B7280' }}>Job not found.</p>
        <Button onClick={() => router.push('/app/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Back + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/app/jobs')}
          style={{ color: '#6B7280', fontWeight: 500 }}
        >
          Jobs
        </Button>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span
          style={{
            fontWeight: 600,
            color: 'var(--text-primary)',
            maxWidth: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {job.searchQuery}
        </span>
      </div>

      {/* Job info card */}
      <Card
        variant="borderless"
        style={{
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          marginBottom: 20,
        }}
      >
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <StatusTag status={job.status} />
              {job.aiEnabled && (
                <Tag
                  icon={<ThunderboltFilled />}
                  style={{
                    color: 'var(--brand)',
                    background: '#EEF2FF',
                    border: '1px solid #C7D2FE',
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  AI Analysis
                </Tag>
              )}
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '0 0 8px',
                letterSpacing: '-0.4px',
              }}
            >
              {job.searchQuery}
            </h2>
            <p style={{ color: '#6B7280', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
              {job.goalPrompt}
            </p>
          </Col>
          <Col xs={24} lg={8}>
            <Descriptions column={1} size="small" style={{ marginTop: 4 }}>
              <Descriptions.Item label="Leads found">
                <span style={{ fontWeight: 700, color: 'var(--brand)', fontSize: 16 }}>
                  {job._count?.leads ?? 0}
                  {job.maxLeads ? ` / ${job.maxLeads}` : ''}
                </span>
              </Descriptions.Item>
              {job.maxLeads && (
                <Descriptions.Item label="Progress">
                  <Progress
                    percent={Math.min(
                      100,
                      Math.round(((job._count?.leads ?? 0) / job.maxLeads) * 100),
                    )}
                    size="small"
                    strokeColor="var(--brand)"
                    style={{ width: 140 }}
                  />
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Created">
                {formatDate(job.createdAt)}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Leads table */}
      <Card
        variant="borderless"
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        title={
          <span style={{ fontWeight: 700, fontSize: 16 }}>
            Leads{leadsData ? ` (${leadsData.totalCount})` : ''}
          </span>
        }
      >
        {leadsLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : leads.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              job.status === 'pending' || job.status === 'running'
                ? 'Job is processing — leads will appear here when ready.'
                : 'No leads found for this job.'
            }
          />
        ) : (
          <Table
            dataSource={leads}
            columns={columns}
            rowKey="id"
            size="middle"
            scroll={{ x: 800 }}
            pagination={{
              current: page,
              pageSize,
              total: leadsData?.totalCount ?? 0,
              onChange: setPage,
              showSizeChanger: false,
              showTotal: (total) => `${total} leads`,
            }}
          />
        )}
      </Card>
    </div>
  );
}
