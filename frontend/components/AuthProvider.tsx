'use client';
import { createContext, useEffect, useState, ReactNode } from 'react';
import {
  User, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider, signInWithPopup,
  sendPasswordResetEmail, updatePassword,
  reauthenticateWithCredential, EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setTokenProvider } from '@/lib/api';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

interface AuthContextValue {
  user: User | null;
  mockMode: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const signOut = async () => {
    if (!USE_MOCK) await firebaseSignOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    if (USE_MOCK) return;
    await sendPasswordResetEmail(auth, email);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (USE_MOCK) return;
    const current = auth.currentUser;
    if (!current || !current.email) throw new Error('You must be signed in to change your password.');
    // Re-authenticate first — Firebase requires a recent login to update a password.
    const credential = EmailAuthProvider.credential(current.email, currentPassword);
    await reauthenticateWithCredential(current, credential);
    await updatePassword(current, newPassword);
  };

  return (
    <AuthContext.Provider value={{ user, mockMode: USE_MOCK, loading, signIn, signUp, signInWithGoogle, signOut, resetPassword, changePassword, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}
