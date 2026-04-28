'use client';

import { useState } from 'react';
import { Table, Input, Select, Button, Skeleton, Empty, Tooltip, Tag } from 'antd';
import {
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useLeads } from '@hooks/useLeads';
import { useJobs } from '@hooks/useJobs';
import type { Lead } from '@appTypes/index';

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span style={{ color: '#9CA3AF' }}>—</span>;
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div
      style={{
        width: 34,
        height: 34,
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
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function LeadsPage() {
  const router = useRouter();
  const { workspaceId } = useWorkspaceContext();
  const [page, setPage] = useState(1);
  const [jobId, setJobId] = useState<string | undefined>();
  const pageSize = 25;

  const { data: leadsData, isLoading: leadsLoading } = useLeads(workspaceId, {
    jobId,
    pageNumber: page,
    limit: pageSize,
  });
  const { data: jobsData } = useJobs(workspaceId, { limit: 100 });

  const leads = leadsData?.leads ?? [];
  const jobOptions = [
    { label: 'All jobs', value: '' },
    ...(jobsData?.jobs ?? []).map((j) => ({
      label: j.searchQuery.length > 40 ? `${j.searchQuery.slice(0, 40)}…` : j.searchQuery,
      value: j.id,
    })),
  ];

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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string | null) =>
        email ? (
          <a href={`mailto:${email}`} style={{ fontSize: 13, color: '#4F46E5' }}>
            <MailOutlined style={{ marginRight: 4 }} />{email}
          </a>
        ) : (
          <span style={{ color: '#9CA3AF' }}>—</span>
        ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string | null) =>
        phone ? (
          <span style={{ fontSize: 13, color: '#374151' }}>
            <PhoneOutlined style={{ marginRight: 4 }} />{phone}
          </span>
        ) : (
          <span style={{ color: '#9CA3AF' }}>—</span>
        ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (url: string | null) =>
        url ? (
          <a
            href={url.startsWith('http') ? url : `https://${url}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, color: '#4F46E5' }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlobalOutlined style={{ marginRight: 4 }} />
            {url.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 30)}
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
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (reason: string | null) =>
        reason ? (
          <Tooltip title={reason}>
            <span style={{ fontSize: 13, color: '#6B7280', cursor: 'help' }}>
              {reason.length > 50 ? `${reason.slice(0, 50)}…` : reason}
            </span>
          </Tooltip>
        ) : (
          <span style={{ color: '#9CA3AF' }}>—</span>
        ),
    },
    {
      title: 'Job',
      key: 'job',
      width: 130,
      render: (_: unknown, record: Lead) => {
        const job = (jobsData?.jobs ?? []).find((j) => j.id === record.jobId);
        return job ? (
          <Tag
            style={{
              cursor: 'pointer',
              fontSize: 11,
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/app/jobs/${job.id}`);
            }}
          >
            {job.searchQuery.length > 18 ? `${job.searchQuery.slice(0, 18)}…` : job.searchQuery}
          </Tag>
        ) : null;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 90,
      render: (d: string) => (
        <span style={{ fontSize: 13, color: '#9CA3AF' }}>{formatDate(d)}</span>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.4px',
            }}
          >
            Leads
          </h1>
          <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: 14 }}>
            {leadsData?.totalCount ?? 0} total leads
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <Select
          value={jobId ?? ''}
          onChange={(v) => {
            setJobId(v || undefined);
            setPage(1);
          }}
          options={jobOptions}
          style={{ width: 280 }}
          placeholder="Filter by job"
          suffixIcon={<SearchOutlined />}
        />
      </div>

      {/* Table */}
      {leadsLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : leads.length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            padding: 60,
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  No leads yet
                </p>
                <p style={{ color: '#6B7280', margin: 0 }}>
                  Create and run a job to start discovering leads.
                </p>
              </div>
            }
          >
            <Button type="primary" onClick={() => router.push('/app/jobs')}>
              Go to Jobs
            </Button>
          </Empty>
        </div>
      ) : (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <Table
            dataSource={leads}
            columns={columns}
            rowKey="id"
            size="middle"
            scroll={{ x: 900 }}
            pagination={{
              current: page,
              pageSize,
              total: leadsData?.totalCount ?? 0,
              onChange: (p) => {
                setPage(p);
                window.scrollTo(0, 0);
              },
              showSizeChanger: false,
              showTotal: (total) => `${total} leads`,
            }}
          />
        </div>
      )}
    </div>
  );
}
