'use client';
import { useState } from 'react';
import { LuPlus, LuTrash2, LuSave } from 'react-icons/lu';
import { addMeal } from '@/lib/api';
import type { MealItem } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

interface Props { onDone: () => void }

const emptyItem = (): MealItem => ({
  name: '', quantity: 100,
  caloriesPer100: 0, proteinPer100: 0,
  carbsPer100: 0, fatPer100: 0, fiberPer100: 0,
});

export function MealForm({ onDone }: Props) {
  const [name, setName] = useState('');
  const [items, setItems] = useState<MealItem[]>([emptyItem()]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const updateItem = (i: number, k: keyof MealItem, v: string) =>
    setItems(prev => prev.map((item, idx) =>
      idx === i ? { ...item, [k]: typeof item[k] === 'number' ? Number(v) || 0 : v } : item
    ));

  const addItem = () => setItems(prev => [...prev, emptyItem()]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Meal name required'); return; }
    if (items.some(it => !it.name.trim())) { setErr('All items need a name'); return; }
    setBusy(true);
    setErr('');
    try {
      await addMeal({ name: name.trim(), items });
      setName('');
      setItems([emptyItem()]);
      onDone();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4">Create Meal Template</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Meal Name" placeholder="e.g. Rice + Dal" value={name} onChange={e => setName(e.target.value)} required />

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Item {i + 1}</span>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <LuTrash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label="Name" placeholder="Ingredient" value={item.name}
                  onChange={e => updateItem(i, 'name', e.target.value)} />
                <Input label="Quantity (g)" type="number" min="0" step="any" value={String(item.quantity)}
                  onChange={e => updateItem(i, 'quantity', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label="Cal/100g" type="number" min="0" step="any" value={String(item.caloriesPer100)}
                  onChange={e => updateItem(i, 'caloriesPer100', e.target.value)} />
                <Input label="Protein/100g" type="number" min="0" step="any" value={String(item.proteinPer100)}
                  onChange={e => updateItem(i, 'proteinPer100', e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input label="Carbs/100g" type="number" min="0" step="any" value={String(item.carbsPer100)}
                  onChange={e => updateItem(i, 'carbsPer100', e.target.value)} />
                <Input label="Fat/100g" type="number" min="0" step="any" value={String(item.fatPer100)}
                  onChange={e => updateItem(i, 'fatPer100', e.target.value)} />
                <Input label="Fiber/100g" type="number" min="0" step="any" value={String(item.fiberPer100)}
                  onChange={e => updateItem(i, 'fiberPer100', e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        <Button type="button" variant="secondary" className="w-full" onClick={addItem}>
          <LuPlus className="w-4 h-4" /> Add Ingredient
        </Button>

        {err && <p className="text-xs text-gray-500">{err}</p>}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Spinner size="sm" /> : <LuSave className="w-4 h-4" />}
          {busy ? 'Saving…' : 'Save Meal'}
        </Button>
      </form>
    </Card>
  );
}
