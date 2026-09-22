/**
 * src/hooks/useAuth.ts
 * ------------------------------------------------------------------
 * Local user state + sign-in / sign-out helpers.
 * Wraps src/lib/auth so React components can subscribe to changes.
 * ------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from 'react';
import type { LocalUser } from '@/types';
import { getCurrentUser, signIn as signInUser, signOut as signOutUser, isValidEmail } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<LocalUser | null>(() => getCurrentUser());

  useEffect(() => {
    // Pick up changes from other tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'dropes:user') setUser(getCurrentUser());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const signIn = useCallback((email: string, name?: string) => {
    if (!isValidEmail(email)) throw new Error('Email inválido');
    setUser(signInUser(email, name));
  }, []);

  const signOut = useCallback(() => {
    signOutUser();
    setUser(null);
  }, []);

  return { user, signIn, signOut, isSignedIn: user !== null };
}
