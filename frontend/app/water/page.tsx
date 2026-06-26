'use client';
import { LuTrash2, LuDroplets } from 'react-icons/lu';
import { today, formatDisplay } from '@/lib/date';
import { deleteWater } from '@/lib/api';
import { useWater } from '@/hooks/useWater';
import { WaterForm } from '@/components/forms/WaterForm';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

const GOAL_ML = 3000;

export default function WaterPage() {
  const date = today();
  const { logs, totalMl, loading, refresh } = useWater(date);

  const handleDelete = async (id: string) => {
    await deleteWater(id);
    refresh();
  };

  const progress = Math.min(1, totalMl / GOAL_ML);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader title="Water" subtitle={formatDisplay(date)} />

      {/* Summary card */}
      <Card className="p-5 mb-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Today</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-50 tabular-nums leading-none">
              {totalMl.toLocaleString()}
              <span className="text-base font-normal text-gray-400 ml-1.5">ml</span>
            </p>
          </div>
          <p className="text-sm text-gray-400 tabular-nums pb-1">/ {GOAL_ML.toLocaleString()} ml</p>
        </div>
        <ProgressBar value={progress} color="bg-blue-500" />
        <p className="text-xs text-gray-400 mt-2 text-right tabular-nums">
          {Math.round((1 - progress) * GOAL_ML).toLocaleString()} ml remaining
        </p>
      </Card>

      {/* Quick add */}
      <Card className="p-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Quick Add</p>
        <WaterForm date={date} onDone={refresh} />
      </Card>

      {loading && <div className="flex justify-center py-8"><Spinner size="lg" /></div>}

      {!loading && logs.length === 0 && (
        <Card className="p-8 text-center">
          <LuDroplets className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No water logged today</p>
          <p className="text-xs text-gray-400 mt-1">Use the buttons above to log your intake</p>
        </Card>
      )}

      {logs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">Log</p>
          {logs.map(log => (
            <Card key={log.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuDroplets className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-50 tabular-nums">
                    {log.amountMl} ml
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
