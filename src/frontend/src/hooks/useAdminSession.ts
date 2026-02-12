import { useState, useEffect, useRef } from 'react';
import { useActor } from './useActor';
import { adminSessionStorage } from '../utils/adminSessionStorage';

type SessionStatus = 'idle' | 'validating' | 'authenticated' | 'error';

interface UseAdminSessionReturn {
  sessionId: string | null;
  status: SessionStatus;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isValidating: boolean;
  retry: () => void;
}

const VALIDATION_TIMEOUT = 10000; // 10 seconds

export function useAdminSession(): UseAdminSessionReturn {
  const { actor, isFetching: actorFetching } = useActor();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const validationAttemptedRef = useRef(false);
  const validationInProgressRef = useRef(false);

  // Validate session with timeout
  const validateStoredSession = async () => {
    // Prevent multiple simultaneous validation attempts
    if (validationInProgressRef.current) {
      return;
    }

    if (!actor) {
      // Actor not ready yet, but don't block the UI
      return;
    }

    const storedSessionId = adminSessionStorage.get();
    if (!storedSessionId) {
      setStatus('idle');
      setError(null);
      validationAttemptedRef.current = true;
      return;
    }

    validationInProgressRef.current = true;
    setStatus('validating');
    setError(null);

    try {
      // Race between validation and timeout
      const validationPromise = actor.validateSession(storedSessionId);
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Session validation timed out')), VALIDATION_TIMEOUT);
      });

      const isValid = await Promise.race([validationPromise, timeoutPromise]);

      if (isValid) {
        setSessionId(storedSessionId);
        setStatus('authenticated');
        setError(null);
      } else {
        // Session is invalid or expired
        adminSessionStorage.clear();
        setSessionId(null);
        setStatus('idle');
        setError(null);
      }
    } catch (err: any) {
      console.error('Session validation error:', err);
      const errorMessage = err?.message?.includes('timed out')
        ? 'Session check timed out. Please try again.'
        : 'Unable to verify session. Please try again.';
      
      // Clear invalid session
      adminSessionStorage.clear();
      setSessionId(null);
      setStatus('error');
      setError(errorMessage);
    } finally {
      validationInProgressRef.current = false;
      validationAttemptedRef.current = true;
    }
  };

  // Load and validate session on mount or when actor becomes available
  useEffect(() => {
    // Only validate once per actor availability
    if (!validationAttemptedRef.current && actor && !actorFetching) {
      validateStoredSession();
    }
  }, [actor, actorFetching]);

  const login = async (username: string, password: string) => {
    if (!actor) {
      throw new Error('Backend not available');
    }

    setStatus('validating');
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

  const retry = () => {
    validationAttemptedRef.current = false;
    validationInProgressRef.current = false;
    setError(null);
    setStatus('idle');
    validateStoredSession();
  };

  return {
    sessionId,
    status,
    error,
    login,
    logout,
    retry,
    isAuthenticated: status === 'authenticated' && !!sessionId,
    isValidating: status === 'validating',
  };
}
