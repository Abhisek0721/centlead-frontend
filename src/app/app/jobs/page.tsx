'use client';

import { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Switch,
  Popconfirm,
  Tooltip,
  Empty,
  Skeleton,
  Space,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltFilled,
  LockFilled,
  RiseOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useJobs, useCreateJob, useDeleteJob } from '@hooks/useJobs';
import type { Job, JobStatus } from '@appTypes/index';

const STATUS_CONFIG: Record<JobStatus, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: '#6B7280', icon: <ClockCircleOutlined />, label: 'Pending' },
  running: { color: '#3B82F6', icon: <SyncOutlined spin />, label: 'Running' },
  completed: { color: '#10B981', icon: <CheckCircleOutlined />, label: 'Done' },
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

function AiToggleCard({ value, onChange, isTrial }: { value?: boolean; onChange?: (v: boolean) => void; isTrial: boolean }) {
  const enabled = isTrial ? true : (value ?? true);

  return (
    <div
      style={{
        border: enabled ? '1.5px solid #4F46E580' : '1.5px solid var(--border)',
        borderRadius: 12,
        padding: '14px 16px',
        background: enabled ? 'linear-gradient(135deg, #4F46E508, #7C3AED08)' : 'var(--bg-surface)',
        marginBottom: 20,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: enabled ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : 'var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <ThunderboltFilled style={{ color: enabled ? '#fff' : '#9CA3AF', fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              AI Lead Intelligence
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              Scores 0–100 · Crawls websites · Explains fit
            </div>
          </div>
        </div>
        {isTrial ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <LockFilled style={{ color: 'var(--brand)', fontSize: 11 }} />
            <Switch checked disabled size="small" style={{ background: '#4F46E5' }} />
          </div>
        ) : (
          <Switch
            checked={enabled}
            onChange={onChange}
            size="small"
            style={enabled ? { background: '#4F46E5' } : {}}
          />
        )}
      </div>

      {/* Body */}
      <div style={{ marginTop: 12, paddingLeft: 46 }}>
        {enabled ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
              For each lead, AI visits the website, evaluates it against your goal, assigns a score, and writes a one-line reason — so you know exactly who to reach out to first.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Lead generation', cost: '1 credit' },
                { label: 'Website crawl', cost: '1 credit' },
                { label: 'AI scoring', cost: '2 credits', highlight: true },
              ].map(({ label, cost, highlight }) => (
                <div
                  key={label}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 20,
                    background: highlight ? '#4F46E515' : 'var(--bg-elevated)',
                    color: highlight ? 'var(--brand)' : 'var(--text-secondary)',
                    border: highlight ? '1px solid #4F46E530' : '1px solid transparent',
                  }}
                >
                  {label} · {cost}
                </div>
              ))}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 20,
                  background: 'var(--text-primary)',
                  color: 'var(--bg-base)',
                }}
              >
                = 4 credits / lead
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <RiseOutlined style={{ color: '#F59E0B', marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: '0 0 4px', fontWeight: 600 }}>
                You&apos;ll get raw leads only — no scores, no website analysis.
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                2 credits/lead · Enable AI to turn raw leads into ranked opportunities.
              </p>
            </div>
          </div>
        )}

        {isTrial && (
          <div
            style={{
              marginTop: 10,
              padding: '8px 10px',
              borderRadius: 8,
              background: '#4F46E510',
              border: '1px solid #4F46E530',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ThunderboltFilled style={{ color: 'var(--brand)', fontSize: 11, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 500 }}>
              AI lead intelligence is enabled during your trial so you can experience the full product.{' '}
              <span style={{ fontWeight: 700 }}>Upgrade to customize analysis.</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  const router = useRouter();
  const { workspaceId, workspace, currentRole } = useWorkspaceContext();
  const isTrial = workspace?.plan === 'trial' || workspace?.plan === 'free';
  const canMutate = currentRole !== 'viewer';
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useJobs(workspaceId, { pageNumber: page, limit: pageSize });
  const createJob = useCreateJob(workspaceId);
  const deleteJob = useDeleteJob(workspaceId);

  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  async function handleCreate(values: { searchQuery: string; goalPrompt: string; aiEnabled: boolean }) {
    try {
      await createJob.mutateAsync({ ...values, aiEnabled: isTrial ? true : values.aiEnabled });
      toast.success('Job created and queued!');
      form.resetFields();
      setShowModal(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to create job');
    }
  }

  async function handleDelete(jobId: string) {
    try {
      await deleteJob.mutateAsync(jobId);
      toast.success('Job deleted');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to delete job');
    }
  }

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (s: JobStatus) => <StatusTag status={s} />,
    },
    {
      title: 'Search Query',
      dataIndex: 'searchQuery',
      key: 'searchQuery',
      render: (text: string, record: Job) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
            {text}
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#9CA3AF',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 400,
            }}
          >
            {record.goalPrompt}
          </div>
        </div>
      ),
    },
    {
      title: 'AI',
      dataIndex: 'aiEnabled',
      key: 'aiEnabled',
      width: 60,
      render: (v: boolean) =>
        v ? (
          <Tooltip title="AI analysis enabled">
            <ThunderboltFilled style={{ color: 'var(--brand)', fontSize: 16 }} />
          </Tooltip>
        ) : null,
    },
    {
      title: 'Leads',
      key: 'leads',
      width: 80,
      render: (_: unknown, record: Job) => (
        <span style={{ fontWeight: 700, color: 'var(--brand)', fontSize: 15 }}>
          {record._count?.leads ?? 0}
        </span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (d: string) => (
        <span style={{ color: '#6B7280', fontSize: 13 }}>{timeAgo(d)}</span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 90,
      render: (_: unknown, record: Job) => (
        <Space size={4}>
          <Tooltip title="View leads">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/app/jobs/${record.id}`);
              }}
            />
          </Tooltip>
          {canMutate && (
            <Popconfirm
              title="Delete this job?"
              description="All associated leads will also be deleted."
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(record.id);
              }}
              onCancel={(e) => e?.stopPropagation()}
              okText="Delete"
              okButtonProps={{ danger: true }}
              disabled={record.status === 'running'}
            >
              <Tooltip title={record.status === 'running' ? 'Cannot delete a running job' : 'Delete'}>
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={record.status === 'running'}
                  onClick={(e) => e.stopPropagation()}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Page header */}
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
            Jobs
          </h1>
          <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: 14 }}>
            {data?.totalCount ?? 0} total jobs
          </p>
        </div>
        {canMutate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setShowModal(true)}
            style={{ fontWeight: 600 }}
          >
            Create Job
          </Button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (data?.jobs ?? []).length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid var(--border)',
            padding: 48,
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  No jobs yet
                </p>
                <p style={{ color: '#6B7280', margin: 0 }}>
                  {canMutate ? 'Create your first job to start discovering leads.' : 'No jobs have been created yet.'}
                </p>
              </div>
            }
          >
            {canMutate && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowModal(true)}
              >
                Create First Job
              </Button>
            )}
          </Empty>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          <Table
            dataSource={data?.jobs ?? []}
            columns={columns}
            rowKey="id"
            size="middle"
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onClick: () => router.push(`/app/jobs/${record.id}`),
            })}
            pagination={{
              current: page,
              pageSize,
              total: data?.totalCount ?? 0,
              onChange: setPage,
              showSizeChanger: false,
              showTotal: (total) => `${total} jobs`,
            }}
          />
        </div>
      )}

      {/* Create Job Modal */}
      <Modal
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
        }}
        title={
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            Create New Job
          </div>
        }
        footer={null}
        width={560}
      >
        <p style={{ color: '#6B7280', marginBottom: 20, fontSize: 14 }}>
          A job searches the web, discovers leads, and optionally runs AI analysis.
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ aiEnabled: true }}
        >
          <Form.Item
            name="searchQuery"
            label="Search Query"
            rules={[{ required: true, message: 'Enter a search query' }]}
            extra="What to search for (e.g. 'Italian restaurants in Chicago')"
          >
            <Input.TextArea
              rows={2}
              placeholder="e.g. Law firms in New York City"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="goalPrompt"
            label="Goal / Instructions"
            rules={[{ required: true, message: 'Describe the goal' }]}
            extra="What you want to learn or extract from each lead"
          >
            <Input.TextArea
              rows={3}
              placeholder="e.g. Find law firms specializing in personal injury with at least 10 attorneys, include contact info and website"
              maxLength={1000}
              showCount
            />
          </Form.Item>

          {/* AI Lead Intelligence toggle */}
          <Form.Item name="aiEnabled" valuePropName="checked" noStyle>
            <AiToggleCard isTrial={isTrial} />
          </Form.Item>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button
              onClick={() => {
                setShowModal(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createJob.isPending}
              icon={<ThunderboltFilled />}
              style={{ fontWeight: 600 }}
            >
              Create &amp; Queue Job
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
