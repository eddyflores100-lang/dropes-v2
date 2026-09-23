/**
 * src/lib/auth.ts
 * ------------------------------------------------------------------
 * Minimal "magic" email-only auth. Persists a local user record so the
 * UI can show "Hola, {name}" and the order history panel.
 *
 * This is NOT real auth — it only personalizes the local experience.
 * For real authentication, integrate Firebase Auth, Clerk, or Auth0.
 * ------------------------------------------------------------------
 */

import type { LocalUser } from '@/types';
import { loadUser, saveUser } from './storage';

export function getCurrentUser(): LocalUser | null {
  return loadUser();
}

export function signIn(email: string, name?: string): LocalUser {
  const user: LocalUser = {
    email: email.trim().toLowerCase(),
    name: (name ?? email.split('@')[0] ?? '').trim() || email,
    createdAt: new Date().toISOString(),
  };
  saveUser(user);
  return user;
}

export function signOut(): void {
  saveUser(null);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
