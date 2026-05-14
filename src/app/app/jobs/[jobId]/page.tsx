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
  Drawer,
  Divider,
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
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useJob } from '@hooks/useJobs';
import { useLeadsByJob } from '@hooks/useLeads';
import type { JobStatus, Lead } from '@appTypes/index';

const STATUS_CONFIG: Record<JobStatus, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: '#6B7280', icon: <ClockCircleOutlined />, label: 'Pending' },
  running: { color: '#3B82F6', icon: <SyncOutlined spin />, label: 'Running' },
  scoring: { color: '#8B5CF6', icon: <ThunderboltFilled />, label: 'Scoring' },
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
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: `${color}15`,
        border: `1.5px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 14,
        color,
      }}
    >
      {Math.round(score)}
    </div>
  );
}

function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <span style={{ color: '#9CA3AF', fontSize: 13 }}>Not scored</span>;
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          background: `${color}15`,
          border: `2px solid ${color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: 18,
          color,
        }}
      >
        {Math.round(score)}
      </div>
      <div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>out of 100</div>
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 4,
            background: '#F3F4F6',
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: `${score}%`,
              height: '100%',
              borderRadius: 4,
              background: color,
            }}
          />
        </div>
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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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
      width: 68,
      sorter: (a: Lead, b: Lead) => (a.score ?? -1) - (b.score ?? -1),
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
      width: 220,
      render: (email: string | null) =>
        email ? (
          <a
            href={`mailto:${email}`}
            style={{ fontSize: 13, color: 'var(--brand)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <MailOutlined style={{ marginRight: 4 }} />{email}
          </a>
        ) : (
          <span style={{ color: '#D1D5DB' }}>—</span>
        ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      render: (phone: string | null) =>
        phone ? (
          <a
            href={`tel:${phone}`}
            style={{ fontSize: 13, color: '#374151' }}
            onClick={(e) => e.stopPropagation()}
          >
            <PhoneOutlined style={{ marginRight: 4, color: '#6B7280' }} />{phone}
          </a>
        ) : (
          <span style={{ color: '#D1D5DB' }}>—</span>
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
            {url.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 28)}
          </a>
        ) : (
          <span style={{ color: '#D1D5DB' }}>—</span>
        ),
    },
    {
      title: 'Why',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string | null) =>
        reason ? (
          <Tooltip title={reason}>
            <span style={{ fontSize: 13, color: '#6B7280', cursor: 'help' }}>
              {reason.length > 70 ? `${reason.slice(0, 70)}…` : reason}
            </span>
          </Tooltip>
        ) : (
          <span style={{ color: '#D1D5DB' }}>—</span>
        ),
    },
    {
      title: '',
      key: 'action',
      width: 40,
      render: (_: unknown, record: Lead) => (
        <Button
          type="text"
          size="small"
          icon={<InfoCircleOutlined />}
          style={{ color: '#9CA3AF' }}
          onClick={(e) => { e.stopPropagation(); setSelectedLead(record); }}
        />
      ),
    },
  ];

  if (jobLoading) {
    return (
      <div style={{ maxWidth: 1200 }}>
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
    <div style={{ maxWidth: 1200 }}>
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
          border: '1px solid var(--border)',
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
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}
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
            pagination={{
              current: page,
              pageSize,
              total: leadsData?.totalCount ?? 0,
              onChange: setPage,
              showSizeChanger: false,
              showTotal: (total) => `${total} leads`,
            }}
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onClick: () => setSelectedLead(record),
            })}
          />
        )}
      </Card>

      {/* Lead detail drawer */}
      <Drawer
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        width={480}
        title={
          selectedLead ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ScoreBadge score={selectedLead.score} />
              <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                {selectedLead.name}
              </span>
            </div>
          ) : null
        }
        styles={{ body: { padding: '16px 24px' } }}
      >
        {selectedLead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Score */}
            <div style={{ marginBottom: 20 }}>
              <ScoreBar score={selectedLead.score} />
            </div>

            <Divider style={{ margin: '0 0 16px' }} />

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {selectedLead.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MailOutlined style={{ color: '#6B7280', fontSize: 14, flexShrink: 0 }} />
                  <a href={`mailto:${selectedLead.email}`} style={{ fontSize: 14, color: 'var(--brand)' }}>
                    {selectedLead.email}
                  </a>
                </div>
              )}
              {selectedLead.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PhoneOutlined style={{ color: '#6B7280', fontSize: 14, flexShrink: 0 }} />
                  <a href={`tel:${selectedLead.phone}`} style={{ fontSize: 14, color: '#374151' }}>
                    {selectedLead.phone}
                  </a>
                </div>
              )}
              {selectedLead.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GlobalOutlined style={{ color: '#6B7280', fontSize: 14, flexShrink: 0 }} />
                  <a
                    href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 14, color: 'var(--brand)', wordBreak: 'break-all' }}
                  >
                    {selectedLead.website}
                  </a>
                </div>
              )}
              {selectedLead.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <EnvironmentOutlined style={{ color: '#6B7280', fontSize: 14, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: '#374151' }}>{selectedLead.address}</span>
                </div>
              )}
            </div>

            {/* Why scored */}
            {selectedLead.reason && (
              <>
                <Divider style={{ margin: '0 0 16px' }} />
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Why this score
                  </div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                    {selectedLead.reason}
                  </p>
                </div>
              </>
            )}

            {/* Website intelligence */}
            {selectedLead.websiteInfo && (
              <>
                <Divider style={{ margin: '0 0 16px' }} />
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Website intelligence
                  </div>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                    {selectedLead.websiteInfo}
                  </p>
                </div>
              </>
            )}

            {/* Key signals from analysis */}
            {selectedLead.analysisJson && (() => {
              const raw = selectedLead.analysisJson as unknown;

              const flatten = (data: unknown): { label: string; value: unknown }[] => {
                if (Array.isArray(data)) {
                  return (data as Record<string, unknown>[]).flatMap((item) => {
                    const name = item.name ?? item.label ?? item.key;
                    if (name !== undefined) return [{ label: String(name), value: item.value ?? item.val ?? item.data }];
                    return Object.entries(item).map(([k, v]) => ({ label: k, value: v }));
                  });
                }
                if (typeof data === 'object' && data !== null) {
                  return Object.entries(data as Record<string, unknown>).flatMap(([k, v]) => {
                    if (Array.isArray(v)) return flatten(v).map((e) => ({ ...e, label: e.label || k }));
                    return [{ label: k, value: v }];
                  });
                }
                return [];
              };

              const isBlank = (val: unknown) =>
                val === null || val === undefined || val === '' ||
                (typeof val === 'string' && ['n/a', 'none', 'unknown', 'no', 'false', '-', '—'].includes(val.toLowerCase())) ||
                (Array.isArray(val) && val.length === 0);

              const renderVal = (val: unknown): { text: string; positive: boolean } => {
                if (typeof val === 'boolean') return { text: val ? 'Yes' : 'No', positive: val };
                if (Array.isArray(val)) {
                  const text = (val as unknown[]).map((v) =>
                    typeof v === 'object' && v !== null
                      ? Object.values(v as Record<string, unknown>).filter(Boolean).join(' ')
                      : String(v)
                  ).filter(Boolean).join(', ');
                  return { text: text || '—', positive: false };
                }
                if (typeof val === 'object' && val !== null) {
                  const text = Object.values(val as Record<string, unknown>).filter(Boolean).join(', ');
                  return { text, positive: false };
                }
                const s = String(val ?? '');
                const positive = ['yes', 'true', 'high', 'strong', 'good', 'available'].includes(s.toLowerCase());
                return { text: s, positive };
              };

              const entries = flatten(raw)
                .filter((e) => e.label && !isBlank(e.value))
                .map((e) => ({ ...e, rendered: renderVal(e.value) }));

              if (entries.length === 0) return null;

              return (
                <>
                  <Divider style={{ margin: '0 0 16px' }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                      Key signals
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {entries.map(({ label, rendered }, i) => (
                        <div key={`${label}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                          <span style={{ fontSize: 13, color: '#6B7280', textTransform: 'capitalize', flexShrink: 0 }}>
                            {label.replace(/_/g, ' ')}
                          </span>
                          <span style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: rendered.positive ? '#059669' : '#111827',
                            textAlign: 'right',
                          }}>
                            {rendered.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Drawer>
    </div>
  );
}
