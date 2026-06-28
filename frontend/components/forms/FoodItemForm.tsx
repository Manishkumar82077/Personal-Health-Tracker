'use client';
import { useState } from 'react';
import { LuSave } from 'react-icons/lu';
import type { FoodItemInput } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  initial?: Partial<FoodItemInput>;
  submitLabel?: string;
  busy?: boolean;
  onSubmit: (data: FoodItemInput) => Promise<void> | void;
  onCancel?: () => void;
}

const toStr = (v: number | undefined) => (v === undefined ? '' : String(v));

export function FoodItemForm({ initial, submitLabel = 'Save item', busy, onSubmit, onCancel }: Props) {
  const [f, setF] = useState({
    name: initial?.name ?? '',
    defaultQuantity: toStr(initial?.defaultQuantity) || '100',
    caloriesPer100: toStr(initial?.caloriesPer100),
    proteinPer100: toStr(initial?.proteinPer100),
    carbsPer100: toStr(initial?.carbsPer100),
    fatPer100: toStr(initial?.fatPer100),
    fiberPer100: toStr(initial?.fiberPer100),
  });
  const [err, setErr] = useState('');

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(prev => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) { setErr('Name is required'); return; }
    setErr('');
    await onSubmit({
      name: f.name.trim(),
      defaultQuantity: Number(f.defaultQuantity) || 100,
      caloriesPer100: Number(f.caloriesPer100) || 0,
      proteinPer100: Number(f.proteinPer100) || 0,
      carbsPer100: Number(f.carbsPer100) || 0,
      fatPer100: Number(f.fatPer100) || 0,
      fiberPer100: Number(f.fiberPer100) || 0,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <Input label="Name" placeholder="e.g. Roti" value={f.name} onChange={set('name')} required />
      <div className="grid grid-cols-2 gap-2">
        <Input label="Serving (g)" type="number" min="0" step="any" placeholder="40" value={f.defaultQuantity} onChange={set('defaultQuantity')} />
        <Input label="Calories /100g" type="number" min="0" step="any" placeholder="297" value={f.caloriesPer100} onChange={set('caloriesPer100')} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input label="Protein /100g" type="number" min="0" step="any" placeholder="11" value={f.proteinPer100} onChange={set('proteinPer100')} />
        <Input label="Carbs /100g" type="number" min="0" step="any" placeholder="50" value={f.carbsPer100} onChange={set('carbsPer100')} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input label="Fat /100g" type="number" min="0" step="any" placeholder="7" value={f.fatPer100} onChange={set('fatPer100')} />
        <Input label="Fiber /100g" type="number" min="0" step="any" placeholder="5" value={f.fiberPer100} onChange={set('fiberPer100')} />
      </div>
      {err && <p className="text-xs text-gray-500">{err}</p>}
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={busy}>
          {busy ? <Spinner size="sm" /> : <LuSave className="w-4 h-4" />}
          {busy ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
