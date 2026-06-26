'use client';
import { useState } from 'react';
import { LuPlus, LuX } from 'react-icons/lu';
import { addWorkout } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  date: string;
  onDone: () => void;
  onCancel: () => void;
}

const EMPTY = { exercise: '', weightKg: '', reps: '', sets: '' };

export function WorkoutForm({ date, onDone, onCancel }: Props) {
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.exercise.trim()) { setErr('Exercise name required'); return; }
    setBusy(true);
    setErr('');
    try {
      await addWorkout({
        exercise: f.exercise.trim(),
        weightKg: Number(f.weightKg) || 0,
        reps:     Number(f.reps)     || 0,
        sets:     Number(f.sets)     || 0,
        date,
      });
      setF(EMPTY);
      onDone();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed to add');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Log Workout</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <LuX className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Exercise" placeholder="e.g. Bench Press" value={f.exercise} onChange={set('exercise')} required />
        <div className="grid grid-cols-3 gap-2">
          <Input label="Sets"      type="number" min="0" placeholder="3" value={f.sets}     onChange={set('sets')} />
          <Input label="Reps"      type="number" min="0" placeholder="8" value={f.reps}     onChange={set('reps')} />
          <Input label="Weight kg" type="number" min="0" step="0.5" placeholder="60" value={f.weightKg} onChange={set('weightKg')} />
        </div>
        {err && <p className="text-xs text-gray-500">{err}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Spinner size="sm" /> : <LuPlus className="w-4 h-4" />}
          {busy ? 'Adding…' : 'Log Workout'}
        </Button>
      </form>
    </Card>
  );
}
