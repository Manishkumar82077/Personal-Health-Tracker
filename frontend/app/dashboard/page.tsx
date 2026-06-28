'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LuSettings, LuChevronLeft, LuChevronRight, LuCircleAlert } from 'react-icons/lu';
import { today, formatDisplay, toDateString } from '@/lib/date';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardGrid } from '@/components/DashboardGrid';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [date, setDate] = useState(today());
  const { dashboard, loading, error } = useDashboard(date);

  const shiftDay = (delta: number) => {
    const d = new Date(date + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    setDate(toDateString(d));
  };

  const isToday = date === today();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Dashboard</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">{formatDisplay(date)}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => shiftDay(-1)}>
            <LuChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDate(today())} disabled={isToday}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={() => shiftDay(1)} disabled={isToday}>
            <LuChevronRight className="w-4 h-4" />
          </Button>
          <ThemeToggle className="w-8 h-8 ml-1" />
          <Link
            href="/settings"
            className="flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1"
          >
            <LuSettings className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl p-4 text-sm">
          <LuCircleAlert className="w-4 h-4 shrink-0" />
          Failed to load: {(error as Error).message}
        </div>
      )}

      {dashboard && <DashboardGrid data={dashboard} />}
    </div>
  );
}
