export type Plan = 'free' | 'trial' | 'starter' | 'growth' | 'pro' | 'agency';
export type Role = 'owner' | 'admin' | 'member' | 'viewer';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';
export type InvitationStatus = 'pending' | 'accepted' | 'expired';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  googleId?: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  plan: Plan;
  monthlyCredits: number;
  creditsRemaining: number;
  trialEndsAt: string | null;
  createdAt: string;
  myRole?: Role;
  _count?: { members: number; jobs: number };
}

export interface Job {
  id: string;
  workspaceId: string;
  createdById: string;
  searchQuery: string;
  goalPrompt: string;
  aiEnabled: boolean;
  analysisSchema: object | null;
  maxLeads: number | null;
  status: JobStatus;
  createdAt: string;
  _count?: { leads: number };
}

export interface Lead {
  id: string;
  workspaceId: string;
  jobId: string;
  name: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  score: number | null;
  reason: string | null;
  analysisJson: object | null;
  createdAt: string;
  job?: Job;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: Role;
  createdAt: string;
  user?: User;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  isExpired?: boolean;
}

export interface Subscription {
  id: string;
  workspaceId: string;
  provider: string;
  externalId: string;
  plan: string;
  status: SubscriptionStatus;
  renewsAt: string;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  workspaceId: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface CreditBalance {
  plan: Plan;
  monthlyCredits: number;
  creditsRemaining: number;
  trialEndsAt: string | null;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiPaginationResponse<T> {
  data: T;
  message: string;
  error: object | null;
  pagination: {
    totalCount: number;
    totalPages: number;
    limit: number;
  };
}

export interface PaginationParams {
  pageNumber?: number;
  limit?: number;
}
