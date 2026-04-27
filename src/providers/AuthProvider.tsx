'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setToken, getToken, removeToken } from '@utils/localStorage';
import envConstant from '@constants/envConstant';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isSignedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.sub || !payload.email) return null;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

function setCookie(value: string) {
  document.cookie = `auth_token=${value}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function clearCookie() {
  document.cookie = 'auth_token=; path=/; max-age=0';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      const decoded = decodeToken(stored);
      if (decoded) {
        setTokenState(stored);
        setUser(decoded);
        // Do NOT re-set cookie here — the cookie is the proxy gate and is only
        // set after a verified auth action (login, verify-email, OAuth, password reset).
        // Re-setting it from localStorage would bypass email verification.
      } else {
        removeToken();
        clearCookie();
      }
    }
    setLoading(false);
  }, []);

  function applyToken(t: string) {
    const decoded = decodeToken(t);
    setToken(t);
    setCookie(t);
    setTokenState(t);
    setUser(decoded);
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${envConstant.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    applyToken(data.data.accessToken);
  }

  async function signup(signupData: SignupData) {
    const res = await fetch(`${envConstant.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    // Store in localStorage only — no cookie. Cookie is set after email verification.
    // This prevents unverified users from bypassing the proxy gate.
    const decoded = decodeToken(data.data.accessToken);
    setToken(data.data.accessToken);
    setTokenState(data.data.accessToken);
    setUser(decoded);
  }

  function logout() {
    removeToken();
    clearCookie();
    setTokenState(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isSignedIn: !!token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
