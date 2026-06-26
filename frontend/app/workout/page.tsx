'use client';
import { useState } from 'react';
import {
  LuPlus, LuTrash2, LuDumbbell,
  LuChevronLeft, LuChevronRight,
} from 'react-icons/lu';
import { today, formatDisplay, toDateString } from '@/lib/date';
import { deleteWorkout } from '@/lib/api';
import { useWorkouts } from '@/hooks/useWorkouts';
import { WorkoutForm } from '@/components/forms/WorkoutForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

export default function WorkoutPage() {
  const [date, setDate] = useState(today());
  const [showForm, setShowForm] = useState(false);
  const { workouts, loading, refresh } = useWorkouts(date);
  const isToday = date === today();

  const shiftDay = (d: number) => {
    const dt = new Date(date + 'T00:00:00');
    dt.setDate(dt.getDate() + d);
    setDate(toDateString(dt));
  };

  const handleDelete = async (id: string) => {
    await deleteWorkout(id);
    refresh();
  };

  const totalVolume = workouts.reduce((s, w) => s + w.sets * w.reps * w.weightKg, 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader
        title="Workout"
        subtitle={`${formatDisplay(date)}${workouts.length > 0 ? ` · ${Math.round(totalVolume).toLocaleString()}kg vol` : ''}`}
        action={
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => shiftDay(-1)}>
              <LuChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDate(today())} disabled={isToday}>Today</Button>
            <Button variant="ghost" size="sm" onClick={() => shiftDay(1)} disabled={isToday}>
              <LuChevronRight className="w-4 h-4" />
            </Button>
          </div>
        }
      />

      {showForm ? (
        <WorkoutForm date={date} onDone={() => { refresh(); setShowForm(false); }} onCancel={() => setShowForm(false)} />
      ) : (
        <Button className="w-full mb-4" onClick={() => setShowForm(true)}>
          <LuPlus className="w-4 h-4" /> Log Exercise
        </Button>
      )}

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {!loading && workouts.length === 0 && (
        <Card className="p-8 text-center">
          <LuDumbbell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No workouts logged {isToday ? 'today' : 'this day'}</p>
          <p className="text-xs text-gray-400 mt-1">Tap &ldquo;Log Exercise&rdquo; to add a set</p>
        </Card>
      )}

      {workouts.length > 0 && (
        <div className="space-y-2">
          {workouts.map(w => (
            <Card key={w.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{w.exercise}</p>
                  <p className="text-xs text-gray-400 tabular-nums mt-0.5">
                    {w.sets} sets × {w.reps} reps @ {w.weightKg} kg
                    <span className="ml-2 text-gray-300 dark:text-gray-600">
                      {(w.sets * w.reps * w.weightKg).toLocaleString()} kg vol
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}

          {workouts.length > 1 && (
            <Card className="px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Session Total</p>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 tabular-nums">
                  {workouts.reduce((s, w) => s + w.sets * w.reps, 0)} reps · {Math.round(totalVolume).toLocaleString()} kg volume
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
