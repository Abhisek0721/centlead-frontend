'use client';

import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Descriptions, Divider, Modal } from 'antd';
import {
  SaveOutlined,
  DeleteOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useUpdateWorkspace, useDeleteWorkspace } from '@hooks/useWorkspace';
import { removeWorkspaceId } from '@utils/localStorage';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function extractError(err: unknown) {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
}

export default function SettingsPage() {
  const router = useRouter();
  const { workspaceId, workspace } = useWorkspaceContext();
  const updateWorkspace = useUpdateWorkspace(workspaceId);
  const deleteWorkspace = useDeleteWorkspace(workspaceId);

  const [form] = Form.useForm();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    if (workspace) {
      form.setFieldsValue({ name: workspace.name });
    }
  }, [workspace, form]);

  async function handleRename(values: { name: string }) {
    try {
      await updateWorkspace.mutateAsync(values.name);
      toast.success('Workspace renamed');
    } catch (err) {
      toast.error(extractError(err) || 'Failed to rename workspace');
    }
  }

  async function handleDelete() {
    try {
      await deleteWorkspace.mutateAsync();
      removeWorkspaceId();
      toast.success('Workspace deleted');
      router.replace('/app');
    } catch (err) {
      toast.error(extractError(err) || 'Failed to delete workspace');
    }
  }

  const canDelete = deleteConfirmText === workspace?.name;

  return (
    <div style={{ maxWidth: 680 }}>
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
          Settings
        </h1>
        <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: 14 }}>
          Manage your workspace configuration.
        </p>
      </div>

      {/* Workspace info */}
      <Card
        variant="borderless"
        style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}
        title={<span style={{ fontWeight: 700 }}>Workspace Info</span>}
      >
        <Descriptions column={1} size="small" style={{ marginBottom: 20 }}>
          <Descriptions.Item label="Created">
            {workspace?.createdAt ? formatDate(workspace.createdAt) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Plan">
            <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
              {workspace?.plan ?? '—'}
            </span>
          </Descriptions.Item>
        </Descriptions>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRename}
        >
          <Form.Item
            name="name"
            label="Workspace name"
            rules={[{ required: true, message: 'Enter a name' }, { max: 100 }]}
          >
            <Input placeholder="Workspace name" maxLength={100} size="large" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateWorkspace.isPending}
            icon={<SaveOutlined />}
            style={{ fontWeight: 600 }}
          >
            Save Changes
          </Button>
        </Form>
      </Card>

      {/* Danger zone */}
      <Card
        variant="borderless"
        style={{
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(239,68,68,0.12)',
          border: '1.5px solid #FEE2E2',
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#EF4444' }}>
            <WarningOutlined />
            <span style={{ fontWeight: 700 }}>Danger Zone</span>
          </div>
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
              Delete this workspace
            </div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>
              Permanently deletes all jobs, leads, team members, and data. This cannot be undone.
            </div>
          </div>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteModal(true)}
            style={{ fontWeight: 600 }}
          >
            Delete Workspace
          </Button>
        </div>
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteModal}
        onCancel={() => {
          setDeleteModal(false);
          setDeleteConfirmText('');
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#EF4444' }}>
            <WarningOutlined />
            <span>Delete Workspace</span>
          </div>
        }
        footer={null}
        width={460}
      >
        <p style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
          This will permanently delete{' '}
          <strong>{workspace?.name}</strong> and all of its data, including jobs, leads, and team members.
        </p>
        <p style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
          Type <strong>{workspace?.name}</strong> to confirm:
        </p>
        <Input
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          placeholder={workspace?.name}
          size="large"
          style={{ marginBottom: 16 }}
        />
        <Divider style={{ margin: '0 0 16px' }} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              setDeleteModal(false);
              setDeleteConfirmText('');
            }}
          >
            Cancel
          </Button>
          <Button
            danger
            type="primary"
            disabled={!canDelete}
            loading={deleteWorkspace.isPending}
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            style={{ fontWeight: 600 }}
          >
            Delete Workspace
          </Button>
        </div>
      </Modal>
    </div>
  );
}
