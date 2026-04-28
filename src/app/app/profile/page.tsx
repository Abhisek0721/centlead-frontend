'use client';

import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Divider, Modal, Avatar, Skeleton } from 'antd';
import { SaveOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useMe, useUpdateProfile, useChangePassword } from '@hooks/useProfile';

function extractError(err: unknown) {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
}

export default function ProfilePage() {
  const { data: user, isLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [profileForm] = Form.useForm();
  const [pwForm] = Form.useForm();
  const [showPwModal, setShowPwModal] = useState(false);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
      });
    }
  }, [user, profileForm]);

  async function handleSaveProfile(values: { firstName: string; lastName: string }) {
    try {
      await updateProfile.mutateAsync(values);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(extractError(err) || 'Failed to update profile');
    }
  }

  async function handleChangePassword(values: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    if (values.newPassword !== values.confirmPassword) {
      pwForm.setFields([{ name: 'confirmPassword', errors: ['Passwords do not match'] }]);
      return;
    }
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed successfully');
      pwForm.resetFields();
      setShowPwModal(false);
    } catch (err) {
      toast.error(extractError(err) || 'Failed to change password');
    }
  }

  const avatarColor = user?.email
    ? `hsl(${(user.email.charCodeAt(0) * 37) % 360}, 55%, 48%)`
    : 'var(--brand)';
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase();
  const isGoogleUser = !!user?.googleId;

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.4px' }}>
          Profile
        </h1>
        <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: 14 }}>
          Manage your personal information and security.
        </p>
      </div>

      {isLoading ? (
        <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      ) : (
        <>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}
          >
            {/* Avatar + email header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <Avatar
                size={56}
                style={{ background: avatarColor, fontWeight: 800, fontSize: 20, flexShrink: 0 }}
              >
                {initials}
              </Avatar>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                  {user?.firstName || user?.lastName
                    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                    : '—'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.email}</div>
                {isGoogleUser && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 12, color: '#6B7280' }}>
                    <GoogleOutlined style={{ fontSize: 11 }} />
                    Signed in with Google
                  </div>
                )}
              </div>
            </div>

            <Divider style={{ margin: '0 0 20px' }} />

            <Form form={profileForm} layout="vertical" onFinish={handleSaveProfile}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Form.Item name="firstName" label="First name" style={{ flex: 1, marginBottom: 16 }}>
                  <Input placeholder="First name" size="large" maxLength={50} />
                </Form.Item>
                <Form.Item name="lastName" label="Last name" style={{ flex: 1, marginBottom: 16 }}>
                  <Input placeholder="Last name" size="large" maxLength={50} />
                </Form.Item>
              </div>

              <Form.Item label="Email address" style={{ marginBottom: 20 }}>
                <Input value={user?.email} disabled size="large" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={updateProfile.isPending}
                icon={<SaveOutlined />}
                style={{ fontWeight: 600 }}
              >
                Save Changes
              </Button>
            </Form>
          </Card>

          {/* Security */}
          <Card
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            title={<span style={{ fontWeight: 700 }}>Security</span>}
          >
            {isGoogleUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                <GoogleOutlined style={{ fontSize: 16, color: '#6B7280' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                    Google account
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>
                    Your account is secured by Google. Password change is not available.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                    Password
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>
                    Update your password to keep your account secure.
                  </div>
                </div>
                <Button
                  icon={<LockOutlined />}
                  onClick={() => setShowPwModal(true)}
                  style={{ fontWeight: 600 }}
                >
                  Change Password
                </Button>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Change password modal */}
      <Modal
        open={showPwModal}
        onCancel={() => { setShowPwModal(false); pwForm.resetFields(); }}
        title={<div style={{ fontWeight: 800, fontSize: 18 }}>Change Password</div>}
        footer={null}
        width={440}
      >
        <p style={{ color: '#6B7280', marginBottom: 20, fontSize: 14 }}>
          Enter your current password and choose a new one.
        </p>
        <Form form={pwForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="currentPassword"
            label="Current password"
            rules={[{ required: true, message: 'Enter your current password' }]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password placeholder="Current password" size="large" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New password"
            rules={[
              { required: true, message: 'Enter a new password' },
              { min: 8, message: 'At least 8 characters' },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password placeholder="New password" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm new password"
            rules={[{ required: true, message: 'Confirm your new password' }]}
            style={{ marginBottom: 20 }}
          >
            <Input.Password placeholder="Confirm new password" size="large" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button onClick={() => { setShowPwModal(false); pwForm.resetFields(); }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={changePassword.isPending}
              icon={<LockOutlined />}
              style={{ fontWeight: 600 }}
            >
              Update Password
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
