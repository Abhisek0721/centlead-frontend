import envConstant from './envConstant';

const BASE = envConstant.NEXT_PUBLIC_API_URL;

export const API_ROUTES = {
  AUTH: {
    ME: `${BASE}/auth/me`,
    SEND_VERIFICATION: `${BASE}/auth/send-verification-email`,
    VERIFY_EMAIL: `${BASE}/auth/verify-email`,
    FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE}/auth/reset-password`,
  },
  WORKSPACES: {
    BASE: `${BASE}/workspaces`,
    BY_ID: (id: string) => `${BASE}/workspaces/${id}`,
  },
  JOBS: {
    BASE: (workspaceId: string) => `${BASE}/workspaces/${workspaceId}/jobs`,
    BY_ID: (workspaceId: string, jobId: string) =>
      `${BASE}/workspaces/${workspaceId}/jobs/${jobId}`,
  },
  LEADS: {
    BY_JOB: (workspaceId: string, jobId: string) =>
      `${BASE}/workspaces/${workspaceId}/jobs/${jobId}/leads`,
    BY_ID: (workspaceId: string, leadId: string) =>
      `${BASE}/workspaces/${workspaceId}/leads/${leadId}`,
  },
  TEAM: {
    MEMBERS: (workspaceId: string) => `${BASE}/workspaces/${workspaceId}/team/members`,
    INVITE: (workspaceId: string) => `${BASE}/workspaces/${workspaceId}/team/invite`,
    INVITATIONS: (workspaceId: string) =>
      `${BASE}/workspaces/${workspaceId}/team/invitations`,
    UPDATE_ROLE: (workspaceId: string, memberId: string) =>
      `${BASE}/workspaces/${workspaceId}/team/members/${memberId}/role`,
    REMOVE: (workspaceId: string, memberId: string) =>
      `${BASE}/workspaces/${workspaceId}/team/members/${memberId}`,
    ACCEPT_INVITE: `${BASE}/team/accept-invite`,
  },
  BILLING: {
    SUBSCRIPTION: (workspaceId: string) =>
      `${BASE}/workspaces/${workspaceId}/billing/subscription`,
  },
  CREDITS: {
    HISTORY: (workspaceId: string) => `${BASE}/workspaces/${workspaceId}/credits/history`,
  },
};
