'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

const PUBLIC_PATHS = ['/', '/login', '/signup'];
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, mockMode, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const authed = mockMode || !!user;

  useEffect(() => {
    if (loading) return;
    if (!authed && !isPublic) router.replace('/login');
  }, [authed, isPublic, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!authed && !isPublic) return null;
  return <>{children}</>;
}
