/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseReady } from './supabase.js';

// IMPORTANT: keep this default in sync with ADMIN_EMAILS in api/_lib/auth.js
// (server is the real gate; client list only controls whether the Admin UI link shows up).
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || 'ivar@agentik.no,ole@agentik.no,ivar@monstr.no')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  ready: false,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  // Start loading only if Supabase is configured. If not, no session work to do.
  const [loading, setLoading] = useState(supabaseReady);

  useEffect(() => {
    if (!supabaseReady) return;

    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (supabaseReady) {
      await supabase.auth.signOut();
    }
    // Wipe per-user caches to prevent shared-device data leak.
    try {
      const keys = Object.keys(window.localStorage);
      for (const k of keys) {
        if (k.startsWith('agentik:partner:') || k.startsWith('agentik:lastVisit:')) {
          window.localStorage.removeItem(k);
        }
      }
    } catch { /* ignore */ }
    setSession(null);
  };

  const userEmail = session?.user?.email?.toLowerCase();
  const isAdmin = userEmail ? ADMIN_EMAILS.includes(userEmail) : false;

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        ready: supabaseReady,
        isAdmin,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
