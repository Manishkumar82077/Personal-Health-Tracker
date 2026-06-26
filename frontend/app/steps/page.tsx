'use client';
import { LuActivity } from 'react-icons/lu';
import { today, formatDisplay } from '@/lib/date';
import { useSteps } from '@/hooks/useSteps';
import { StepsForm } from '@/components/forms/StepsForm';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

const GOAL = 10000;

export default function StepsPage() {
  const date = today();
  const { steps, loading, refresh } = useSteps(date);

  const count = steps?.count ?? 0;
  const progress = Math.min(1, count / GOAL);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader title="Steps" subtitle={formatDisplay(date)} />

      <Card className="p-5 mb-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <LuActivity className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Today</p>
            </div>
            <p className="text-5xl font-bold text-gray-900 dark:text-gray-50 tabular-nums leading-none">
              {count.toLocaleString()}
            </p>
          </div>
          <p className="text-sm text-gray-400 pb-1 tabular-nums">/ {GOAL.toLocaleString()}</p>
        </div>
        <ProgressBar value={progress} color="bg-teal-500" />
        <p className="text-xs text-gray-400 mt-2 text-right tabular-nums">
          {Math.max(0, GOAL - count).toLocaleString()} steps remaining
        </p>
      </Card>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner size="lg" /></div>
      ) : (
        <Card className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Update Count</p>
          <StepsForm date={date} current={count} onDone={refresh} />
        </Card>
      )}
    </div>
  );
}
