'use client';
import { useState } from 'react';
import { LuPlus, LuX } from 'react-icons/lu';
import { addFood } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  date: string;
  onDone: () => void;
  onCancel: () => void;
}

const EMPTY = { name: '', quantity: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' };

export function FoodForm({ date, onDone, onCancel }: Props) {
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) { setErr('Name is required'); return; }
    setBusy(true);
    setErr('');
    try {
      await addFood({
        name: f.name.trim(),
        quantity: Number(f.quantity) || 0,
        calories: Number(f.calories) || 0,
        protein:  Number(f.protein)  || 0,
        carbs:    Number(f.carbs)    || 0,
        fat:      Number(f.fat)      || 0,
        fiber:    Number(f.fiber)    || 0,
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
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Add Food Entry</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <LuX className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Name" placeholder="e.g. Brown rice" value={f.name} onChange={set('name')} required />
        <div className="grid grid-cols-2 gap-2">
          <Input label="Quantity (g)" type="number" min="0" step="any" placeholder="200" value={f.quantity} onChange={set('quantity')} />
          <Input label="Calories" type="number" min="0" step="any" placeholder="260" value={f.calories} onChange={set('calories')} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input label="Protein (g)" type="number" min="0" step="any" placeholder="5" value={f.protein} onChange={set('protein')} />
          <Input label="Carbs (g)"   type="number" min="0" step="any" placeholder="54" value={f.carbs}   onChange={set('carbs')} />
          <Input label="Fat (g)"     type="number" min="0" step="any" placeholder="2"  value={f.fat}     onChange={set('fat')} />
        </div>
        <Input label="Fiber (g)" type="number" min="0" step="any" placeholder="3.5" value={f.fiber} onChange={set('fiber')} />
        {err && <p className="text-xs text-gray-500">{err}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Spinner size="sm" /> : <LuPlus className="w-4 h-4" />}
          {busy ? 'Adding…' : 'Add Entry'}
        </Button>
      </form>
    </Card>
  );
}
