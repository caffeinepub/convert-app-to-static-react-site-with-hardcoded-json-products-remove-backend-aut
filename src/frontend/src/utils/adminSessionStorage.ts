const ADMIN_SESSION_KEY = 'aa_boxes_admin_session';

export const adminSessionStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY);
    } catch {
      return null;
    }
  },

  set(sessionId: string): void {
    try {
      localStorage.setItem(ADMIN_SESSION_KEY, sessionId);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  },
};
