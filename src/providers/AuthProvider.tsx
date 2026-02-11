import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Family } from '../types/database';

interface AuthState {
  session: Session | null;
  user: User | null;
  family: Family | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, familyName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    family: null,
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadFamily(session.user.id).then((family) => {
          setState({ session, user: session.user, family, isLoading: false });
        });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          const family = await loadFamily(session.user.id);
          setState({ session, user: session.user, family, isLoading: false });
        } else {
          setState({ session: null, user: null, family: null, isLoading: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadFamily(userId: string): Promise<Family | null> {
    const { data } = await supabase
      .from('families')
      .select('*')
      .eq('owner_id', userId)
      .single();
    return data;
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string, familyName: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'לא ניתן ליצור משתמש' };

    // Create family record
    const { error: familyError } = await supabase.from('families').insert({
      name: familyName,
      owner_id: data.user.id,
    });
    if (familyError) return { error: familyError.message };

    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
