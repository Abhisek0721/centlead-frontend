'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal, Form, Input, Button } from 'antd';
import toast from 'react-hot-toast';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import { setWorkspaceId, getWorkspaceId } from '@utils/localStorage';
import type { ApiResponse, Workspace } from '@appTypes/index';

export const WORKSPACE_QUERY_KEY = 'workspaces';

interface WorkspaceContextType {
  workspaceId: string;
  workspace: Workspace | null;
  workspaces: Workspace[];
  switchWorkspace: (id: string) => void;
  openCreateModal: () => void;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaceId: '',
  workspace: null,
  workspaces: [],
  switchWorkspace: () => {},
  openCreateModal: () => {},
  isLoading: true,
});

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: [WORKSPACE_QUERY_KEY],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<Workspace[]>>(
        API_ROUTES.WORKSPACES.BASE,
      );
      return data.data;
    },
  });

  useEffect(() => {
    if (isLoading) return;
    if (workspaces.length === 0) {
      setShowCreateModal(true);
      return;
    }
    const saved = getWorkspaceId();
    const validId =
      saved && workspaces.some((w) => w.id === saved) ? saved : workspaces[0].id;
    setActiveId(validId);
    setWorkspaceId(validId);
  }, [workspaces, isLoading]);

  function switchWorkspace(id: string) {
    setActiveId(id);
    setWorkspaceId(id);
  }

  function openCreateModal() {
    setShowCreateModal(true);
  }

  async function handleCreate(values: { name: string }) {
    setCreating(true);
    try {
      const { data } = await axiosInstance.post<ApiResponse<Workspace>>(
        API_ROUTES.WORKSPACES.BASE,
        { name: values.name },
      );
      await qc.invalidateQueries({ queryKey: [WORKSPACE_QUERY_KEY] });
      setActiveId(data.data.id);
      setWorkspaceId(data.data.id);
      setShowCreateModal(false);
      form.resetFields();
      toast.success('Workspace created!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg || 'Failed to create workspace');
    } finally {
      setCreating(false);
    }
  }

  const workspace = workspaces.find((w) => w.id === activeId) ?? null;

  return (
    <WorkspaceContext.Provider
      value={{ workspaceId: activeId, workspace, workspaces, switchWorkspace, openCreateModal, isLoading }}
    >
      {children}

      <Modal
        open={showCreateModal}
        closable={workspaces.length > 0}
        mask={{ closable: workspaces.length > 0 }}
        onCancel={() => {
          if (workspaces.length > 0) {
            setShowCreateModal(false);
            form.resetFields();
          }
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              C
            </div>
            <span>{workspaces.length === 0 ? 'Create your workspace' : 'New workspace'}</span>
          </div>
        }
        footer={null}
      >
        <p style={{ color: '#6B7280', marginBottom: 20, fontSize: 14 }}>
          Give your workspace a name to get started. You can always rename it later.
        </p>
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="name"
            label="Workspace name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="e.g. Acme Corp" maxLength={100} size="large" autoFocus />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={creating} block size="large">
            Create workspace →
          </Button>
        </Form>
      </Modal>
    </WorkspaceContext.Provider>
  );
}
