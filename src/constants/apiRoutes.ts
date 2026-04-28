import envConstant from './envConstant';

const BASE = `${envConstant.NEXT_PUBLIC_API_URL}/api`;

export const API_ROUTES = {
  AUTH: {
    ME: `${BASE}/auth/me`,
    SEND_VERIFICATION: `${BASE}/auth/send-verification-email`,
    RESEND_VERIFICATION: `${BASE}/auth/resend-verification`,
    VERIFY_EMAIL: `${BASE}/auth/verify-email`,
    FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE}/auth/reset-password`,
  },
  WORKSPACES: {
    BASE: `${BASE}/workspace`,
    BY_ID: (id: string) => `${BASE}/workspace/${id}`,
  },
  JOBS: {
    BASE: (workspaceId: string) => `${BASE}/workspace/${workspaceId}/jobs`,
    BY_ID: (workspaceId: string, jobId: string) =>
      `${BASE}/workspace/${workspaceId}/jobs/${jobId}`,
  },
  LEADS: {
    BASE: (workspaceId: string) => `${BASE}/workspace/${workspaceId}/leads`,
    BY_JOB: (workspaceId: string, jobId: string) =>
      `${BASE}/workspace/${workspaceId}/leads/job/${jobId}`,
    BY_ID: (workspaceId: string, leadId: string) =>
      `${BASE}/workspace/${workspaceId}/leads/${leadId}`,
  },
  TEAM: {
    MEMBERS: (workspaceId: string) => `${BASE}/workspace/${workspaceId}/team/members`,
    INVITE: (workspaceId: string) => `${BASE}/workspace/${workspaceId}/team/invite`,
    INVITATIONS: (workspaceId: string) =>
      `${BASE}/workspace/${workspaceId}/team/invitations`,
    UPDATE_ROLE: (workspaceId: string, memberId: string) =>
      `${BASE}/workspace/${workspaceId}/team/members/${memberId}/role`,
    REMOVE: (workspaceId: string, memberId: string) =>
      `${BASE}/workspace/${workspaceId}/team/members/${memberId}`,
    ACCEPT_INVITE: (workspaceId: string) =>
      `${BASE}/workspace/${workspaceId}/team/accept-invite`,
  },
  CREDITS: {
    BALANCE: (workspaceId: string) => `${BASE}/workspace/${workspaceId}/credits`,
    TRANSACTIONS: (workspaceId: string) =>
      `${BASE}/workspace/${workspaceId}/credits/transactions`,
  },
  BILLING: {
    PLANS: `${BASE}/billing/plans`,
  },
};
