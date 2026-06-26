'use client';
import { LuMoon, LuBed, LuClock } from 'react-icons/lu';
import { today, formatDisplay } from '@/lib/date';
import { useSleep } from '@/hooks/useSleep';
import { SleepForm } from '@/components/forms/SleepForm';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

const GOAL_HOURS = 8;

export default function SleepPage() {
  const date = today();
  const { sleep, loading, refresh } = useSleep(date);

  const hours = sleep ? sleep.durationMinutes / 60 : 0;
  const progress = Math.min(1, hours / GOAL_HOURS);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader title="Sleep" subtitle={formatDisplay(date)} />

      {sleep && (
        <Card className="p-5 mb-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <LuMoon className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Last night</p>
              </div>
              <p className="text-5xl font-bold text-gray-900 dark:text-gray-50 tabular-nums leading-none">
                {hours.toFixed(1)}
                <span className="text-xl font-normal text-gray-400 ml-1">h</span>
              </p>
            </div>
            <p className="text-sm text-gray-400 pb-1">/ {GOAL_HOURS}h goal</p>
          </div>
          <ProgressBar value={progress} color="bg-violet-500" />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <LuBed className="w-3.5 h-3.5" />
              <span>{sleep.sleepTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <LuClock className="w-3.5 h-3.5" />
              <span>{sleep.wakeTime}</span>
            </div>
          </div>
        </Card>
      )}

      {!sleep && !loading && (
        <Card className="p-8 text-center mb-4">
          <LuMoon className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No sleep logged yet</p>
          <p className="text-xs text-gray-400 mt-1">Log your bedtime and wake time below</p>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Spinner size="lg" /></div>
      ) : (
        <Card className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {sleep ? 'Update Sleep' : 'Log Sleep'}
          </p>
          <SleepForm date={date} current={sleep} onDone={refresh} />
        </Card>
      )}
    </div>
  );
}
