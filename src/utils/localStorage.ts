const TOKEN_KEY = 'centlead_token';
const WORKSPACE_KEY = 'centlead_workspace_id';

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setWorkspaceId = (id: string): void => {
  localStorage.setItem(WORKSPACE_KEY, id);
};

export const getWorkspaceId = (): string | null => {
  return localStorage.getItem(WORKSPACE_KEY);
};

export const removeWorkspaceId = (): void => {
  localStorage.removeItem(WORKSPACE_KEY);
};
