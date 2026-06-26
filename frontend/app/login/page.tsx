'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LuUser, LuLogOut, LuCircleAlert } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

export default function LoginPage() {
  const { user, mockMode, loading, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && (user || mockMode)) router.replace('/');
  }, [user, mockMode, loading, router]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signIn(email, password);
      router.replace('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setBusy(true);
    try {
      await signInWithGoogle();
      router.replace('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign in failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 dark:bg-gray-50 mb-4">
            <LuUser className="w-7 h-7 text-white dark:text-gray-900" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Health Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          {mockMode && (
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-xl px-3 py-2.5">
              <LuCircleAlert className="w-3.5 h-3.5 flex-shrink-0" />
              Mock mode — no real credentials needed
            </div>
          )}

          <form onSubmit={handleEmail} className="space-y-3">
            <Input id="email" label="Email" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <Input id="password" label="Password" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <LuCircleAlert className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Spinner size="sm" /> : <LuLogOut className="w-4 h-4" />}
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-400">or</span>
            </div>
          </div>

          <Button variant="secondary" className="w-full" onClick={handleGoogle} disabled={busy}>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
