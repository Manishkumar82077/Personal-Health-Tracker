'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuUser, LuLogOut, LuCircleAlert } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

export default function LoginPage() {
  const { user, mockMode, loading, signIn, resetPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && (user || mockMode)) router.replace('/dashboard');
  }, [user, mockMode, loading, router]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await signIn(email, password);
      router.replace('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async () => {
    setError('');
    setNotice('');
    if (!email) {
      setError('Enter your email above, then tap “Forgot password?”');
      return;
    }
    try {
      await resetPassword(email);
      setNotice(`Password reset link sent to ${email}. Check your inbox.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not send reset email');
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
            <div className="flex justify-end">
              <button type="button" onClick={handleForgot}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 hover:underline">
                Forgot password?
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <LuCircleAlert className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}
            {notice && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5">
                <LuCircleAlert className="w-3.5 h-3.5 flex-shrink-0" />
                {notice}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Spinner size="sm" /> : <LuLogOut className="w-4 h-4" />}
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-gray-900 dark:text-gray-50 font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
