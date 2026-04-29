'use client';

import { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Skeleton,
  Empty,
  Avatar,
  Space,
  Tooltip,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  UserDeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useWorkspaceContext } from '@providers/WorkspaceProvider';
import { useAuth } from '@providers/AuthProvider';
import {
  useTeamMembers,
  useInvitations,
  useInviteMember,
  useUpdateMemberRole,
  useRemoveMember,
  useResendInvite,
} from '@hooks/useTeam';
import type { WorkspaceMember, WorkspaceInvitation, Role } from '@appTypes/index';

const ROLE_CONFIG: Record<Role, { color: string; label: string }> = {
  owner: { color: '#7C3AED', label: 'Owner' },
  admin: { color: '#3B82F6', label: 'Admin' },
  member: { color: '#6B7280', label: 'Member' },
  viewer: { color: '#9CA3AF', label: 'Viewer' },
};

function RoleTag({ role }: { role: Role }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <Tag
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function extractError(err: unknown) {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
}

export default function TeamPage() {
  const { workspaceId, workspace } = useWorkspaceContext();
  const { user } = useAuth();

  const { data: members = [], isLoading: membersLoading } = useTeamMembers(workspaceId);
  const { data: invitations = [], isLoading: invitationsLoading } = useInvitations(workspaceId);
  const inviteMember = useInviteMember(workspaceId);
  const updateRole = useUpdateMemberRole(workspaceId);
  const removeMember = useRemoveMember(workspaceId);
  const resendInvite = useResendInvite(workspaceId);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [form] = Form.useForm();

  const currentMember = members.find((m) => m.user?.email === user?.email);
  const isOwnerOrAdmin =
    currentMember?.role === 'owner' || currentMember?.role === 'admin';

  async function handleInvite(values: { email: string; role: Role }) {
    try {
      await inviteMember.mutateAsync(values);
      toast.success(`Invite sent to ${values.email}`);
      form.resetFields();
      setShowInviteModal(false);
    } catch (err) {
      toast.error(extractError(err) || 'Failed to send invite');
    }
  }

  async function handleRoleChange(memberId: string, role: Role) {
    try {
      await updateRole.mutateAsync({ memberId, role });
      toast.success('Role updated');
    } catch (err) {
      toast.error(extractError(err) || 'Failed to update role');
    }
  }

  async function handleRemove(memberId: string) {
    try {
      await removeMember.mutateAsync(memberId);
      toast.success('Member removed');
    } catch (err) {
      toast.error(extractError(err) || 'Failed to remove member');
    }
  }

  async function handleResend(invitationId: string, email: string) {
    try {
      await resendInvite.mutateAsync(invitationId);
      toast.success(`Invitation resent to ${email}`);
    } catch (err) {
      toast.error(extractError(err) || 'Failed to resend invitation');
    }
  }

  const memberColumns = [
    {
      title: 'Member',
      key: 'member',
      render: (_: unknown, record: WorkspaceMember) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar
            style={{
              background: `hsl(${((record.user?.email?.charCodeAt(0) ?? 0) * 37) % 360}, 55%, 55%)`,
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
            }}
            size={36}
          >
            {(record.user?.email?.[0] ?? '?').toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
              {record.user?.firstName || record.user?.lastName
                ? `${record.user.firstName ?? ''} ${record.user.lastName ?? ''}`.trim()
                : record.user?.email}
            </div>
            {(record.user?.firstName || record.user?.lastName) && (
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>{record.user?.email}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 160,
      render: (role: Role, record: WorkspaceMember) => {
        const isCurrentUser = record.user?.email === user?.email;
        const isOwner = role === 'owner';
        if (!isOwnerOrAdmin || isOwner || isCurrentUser) {
          return <RoleTag role={role} />;
        }
        return (
          <Select
            value={role}
            size="small"
            style={{ width: 120 }}
            onChange={(newRole) => handleRoleChange(record.id, newRole)}
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Member', value: 'member' },
              { label: 'Viewer', value: 'viewer' },
            ]}
          />
        );
      },
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (d: string) => (
        <span style={{ fontSize: 13, color: '#6B7280' }}>{formatDate(d)}</span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: unknown, record: WorkspaceMember) => {
        const isOwner = record.role === 'owner';
        const isCurrentUser = record.user?.email === user?.email;
        if (!isOwnerOrAdmin || isOwner || isCurrentUser) return null;
        return (
          <Popconfirm
            title="Remove this member?"
            description="They will lose access to this workspace."
            onConfirm={() => handleRemove(record.id)}
            okText="Remove"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Remove member">
              <Button type="text" size="small" danger icon={<UserDeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        );
      },
    },
  ];

  const inviteColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{email}</span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: Role) => <RoleTag role={role} />,
    },
    {
      title: 'Status',
      key: 'status',
      width: 130,
      render: (_: unknown, record: WorkspaceInvitation) => {
        if (record.isExpired || record.status === 'expired') {
          return (
            <Tag style={{ color: '#EF4444', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 6 }}>
              Expired
            </Tag>
          );
        }
        if (record.status === 'accepted') {
          return (
            <Tag icon={<CheckCircleOutlined />} style={{ color: '#10B981', background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 6 }}>
              Accepted
            </Tag>
          );
        }
        return (
          <Tag icon={<ClockCircleOutlined />} style={{ color: '#F59E0B', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 6 }}>
            Pending
          </Tag>
        );
      },
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      width: 130,
      render: (d: string) => (
        <span style={{ fontSize: 13, color: '#6B7280' }}>{formatDate(d)}</span>
      ),
    },
    {
      title: 'Sent',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (d: string) => (
        <span style={{ fontSize: 13, color: '#9CA3AF' }}>{formatDate(d)}</span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: WorkspaceInvitation) => {
        if (record.status === 'accepted' || !isOwnerOrAdmin) return null;
        return (
          <Tooltip title="Resend invitation">
            <Button
              type="text"
              size="small"
              icon={<SendOutlined />}
              loading={resendInvite.isPending}
              onClick={() => handleResend(record.id, record.email)}
              style={{ color: 'var(--brand)' }}
            >
              Resend
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
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
            Team
          </h1>
          <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: 14 }}>
            {members.length} member{members.length !== 1 ? 's' : ''} in {workspace?.name}
          </p>
        </div>
        {isOwnerOrAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setShowInviteModal(true)}
            style={{ fontWeight: 600 }}
          >
            Invite Member
          </Button>
        )}
      </div>

      <Tabs
        defaultActiveKey="members"
        items={[
          {
            key: 'members',
            label: `Members (${members.length})`,
            children: (
              <div
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                }}
              >
                {membersLoading ? (
                  <div style={{ padding: 24 }}>
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </div>
                ) : (
                  <Table
                    dataSource={members}
                    columns={memberColumns}
                    rowKey="id"
                    size="middle"
                    pagination={false}
                  />
                )}
              </div>
            ),
          },
          {
            key: 'invitations',
            label: `Invitations (${invitations.filter((i) => i.status === 'pending' && !i.isExpired).length} pending)`,
            children: (
              <div
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                }}
              >
                {invitationsLoading ? (
                  <div style={{ padding: 24 }}>
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </div>
                ) : invitations.length === 0 ? (
                  <div style={{ padding: 48 }}>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No invitations sent yet."
                    />
                  </div>
                ) : (
                  <Table
                    dataSource={invitations}
                    columns={inviteColumns}
                    rowKey="id"
                    size="middle"
                    pagination={false}
                  />
                )}
              </div>
            ),
          },
        ]}
      />

      {/* Invite Modal */}
      <Modal
        open={showInviteModal}
        onCancel={() => {
          setShowInviteModal(false);
          form.resetFields();
        }}
        title={<div style={{ fontWeight: 800, fontSize: 18 }}>Invite Team Member</div>}
        footer={null}
        width={480}
      >
        <p style={{ color: '#6B7280', marginBottom: 20, fontSize: 14 }}>
          They&apos;ll receive an email with a link to join your workspace.
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleInvite}
          initialValues={{ role: 'member' }}
        >
          <Form.Item
            name="email"
            label="Email address"
            rules={[
              { required: true, message: 'Enter an email address' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input placeholder="colleague@company.com" size="large" />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Select
              size="large"
              options={[
                { label: 'Admin — can manage everything except billing', value: 'admin' },
                { label: 'Member — can view and create jobs', value: 'member' },
                { label: 'Viewer — read-only access', value: 'viewer' },
              ]}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button onClick={() => { setShowInviteModal(false); form.resetFields(); }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={inviteMember.isPending}
              style={{ fontWeight: 600 }}
            >
              Send Invite
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
