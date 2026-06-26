'use client';
import { createContext, useEffect, useState, ReactNode } from 'react';
import {
  User, onAuthStateChanged,
  signInWithEmailAndPassword, signOut as firebaseSignOut,
  GoogleAuthProvider, signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setTokenProvider } from '@/lib/api';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

interface AuthContextValue {
  user: User | null;
  mockMode: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = async (): Promise<string | null> => {
    if (USE_MOCK) return 'mock-token';
    return user ? user.getIdToken() : null;
  };

  useEffect(() => {
    // Register the token getter so lib/api.ts can attach Bearer tokens
    setTokenProvider(getToken);
  });

  useEffect(() => {
    if (USE_MOCK) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const signOut = async () => {
    if (!USE_MOCK) await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, mockMode: USE_MOCK, loading, signIn, signInWithGoogle, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}
