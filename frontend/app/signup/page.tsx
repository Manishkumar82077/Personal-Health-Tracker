'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuUser, LuCircleAlert } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

export default function SignupPage() {
  const { user, mockMode, loading, signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && (user || mockMode)) router.replace('/');
  }, [user, mockMode, loading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setBusy(true);
    try {
      await signUp(email, password);
      router.replace('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your account</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <form onSubmit={handleSignup} className="space-y-3">
            <Input id="email" label="Email" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <Input id="password" label="Password" type="password" placeholder="Min. 6 characters"
              value={password} onChange={e => setPassword(e.target.value)} required />
            <Input id="confirm" label="Confirm password" type="password" placeholder="••••••••"
              value={confirm} onChange={e => setConfirm(e.target.value)} required />

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <LuCircleAlert className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Spinner size="sm" /> : null}
              {busy ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-gray-900 dark:text-gray-50 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
