import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { adminSessionStorage } from '../utils/adminSessionStorage';

type SessionStatus = 'idle' | 'loading' | 'authenticated' | 'error';

interface UseAdminSessionReturn {
  sessionId: string | null;
  status: SessionStatus;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAdminSession(): UseAdminSessionReturn {
  const { actor, isFetching: actorFetching } = useActor();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Load and validate session on mount
  useEffect(() => {
    const validateStoredSession = async () => {
      if (!actor || actorFetching) return;

      const storedSessionId = adminSessionStorage.get();
      if (!storedSessionId) {
        setStatus('idle');
        return;
      }

      setStatus('loading');
      try {
        const isValid = await actor.validateSession(storedSessionId);
        if (isValid) {
          setSessionId(storedSessionId);
          setStatus('authenticated');
          setError(null);
        } else {
          adminSessionStorage.clear();
          setSessionId(null);
          setStatus('idle');
        }
      } catch (err: any) {
        console.error('Session validation error:', err);
        adminSessionStorage.clear();
        setSessionId(null);
        setStatus('idle');
      }
    };

    validateStoredSession();
  }, [actor, actorFetching]);

  const login = async (username: string, password: string) => {
    if (!actor) {
      throw new Error('Backend not available');
    }

    setStatus('loading');
    setError(null);

    try {
      const newSessionId = await actor.adminLogin(username, password);
      adminSessionStorage.set(newSessionId);
      setSessionId(newSessionId);
      setStatus('authenticated');
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed';
      setError(errorMessage);
      setStatus('error');
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    if (!actor || !sessionId) {
      adminSessionStorage.clear();
      setSessionId(null);
      setStatus('idle');
      return;
    }

    try {
      await actor.adminLogout(sessionId);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      adminSessionStorage.clear();
      setSessionId(null);
      setStatus('idle');
      setError(null);
    }
  };

  return {
    sessionId,
    status,
    error,
    login,
    logout,
    isAuthenticated: status === 'authenticated' && !!sessionId,
    isLoading: status === 'loading' || actorFetching,
  };
}
