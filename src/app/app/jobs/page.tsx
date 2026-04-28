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

export default function JobsPage() {
  const router = useRouter();
  const { workspaceId } = useWorkspaceContext();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useJobs(workspaceId, { pageNumber: page, limit: pageSize });
  const createJob = useCreateJob(workspaceId);
  const deleteJob = useDeleteJob(workspaceId);

  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  async function handleCreate(values: { searchQuery: string; goalPrompt: string; aiEnabled: boolean }) {
    try {
      await createJob.mutateAsync(values);
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
            <ThunderboltFilled style={{ color: '#4F46E5', fontSize: 16 }} />
          </Tooltip>
        ) : null,
    },
    {
      title: 'Leads',
      key: 'leads',
      width: 80,
      render: (_: unknown, record: Job) => (
        <span style={{ fontWeight: 700, color: '#4F46E5', fontSize: 15 }}>
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
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setShowModal(true)}
          style={{ fontWeight: 600 }}
        >
          Create Job
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (data?.jobs ?? []).length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
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
                  Create your first job to start discovering leads.
                </p>
              </div>
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowModal(true)}
            >
              Create First Job
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

          <Form.Item
            name="aiEnabled"
            label="AI Analysis"
            valuePropName="checked"
            extra="AI scores and enriches each lead. Recommended."
          >
            <Switch defaultChecked />
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
