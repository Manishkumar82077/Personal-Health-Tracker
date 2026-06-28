'use client';
import { useState } from 'react';
import { LuPlus, LuTrash2, LuSave } from 'react-icons/lu';
import { addMeal, updateMeal } from '@/lib/api';
import type { Meal, MealItem, FoodItem } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  onDone: (meal?: Meal) => void;
  onCancel?: () => void;
  libraryItems?: FoodItem[];
  /** When set, the form edits an existing meal instead of creating one. */
  initial?: Meal;
  submitLabel?: string;
}

const emptyItem = (): MealItem => ({
  name: '', quantity: 100,
  caloriesPer100: 0, proteinPer100: 0,
  carbsPer100: 0, fatPer100: 0, fiberPer100: 0,
});

const itemFromLibrary = (it: FoodItem): MealItem => ({
  name: it.name,
  quantity: it.defaultQuantity || 100,
  caloriesPer100: it.caloriesPer100,
  proteinPer100: it.proteinPer100,
  carbsPer100: it.carbsPer100,
  fatPer100: it.fatPer100,
  fiberPer100: it.fiberPer100,
  sourceItemId: it.id,
});

export function MealForm({ onDone, onCancel, libraryItems = [], initial, submitLabel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [items, setItems] = useState<MealItem[]>(initial?.items ?? [emptyItem()]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const matches = query.trim()
    ? libraryItems.filter(it => it.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : [];

  const updateItem = (i: number, k: keyof MealItem, v: string) =>
    setItems(prev => prev.map((item, idx) =>
      idx === i ? { ...item, [k]: typeof item[k] === 'number' ? Number(v) || 0 : v } : item
    ));

  const addBlank = () => setItems(prev => [...prev, emptyItem()]);
  const addFromLibrary = (it: FoodItem) => {
    setItems(prev => {
      // Drop a leading empty placeholder row if it's still untouched.
      const base = prev.length === 1 && !prev[0].name.trim() ? [] : prev;
      return [...base, itemFromLibrary(it)];
    });
    setQuery('');
  };
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Meal name required'); return; }
    if (items.length === 0) { setErr('Add at least one item'); return; }
    if (items.some(it => !it.name.trim())) { setErr('All items need a name'); return; }
    setBusy(true);
    setErr('');
    try {
      const meal = initial
        ? await updateMeal(initial.id, { name: name.trim(), items })
        : await addMeal({ name: name.trim(), items });
      onDone(meal);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Meal Name" placeholder="e.g. Rice + Dal" value={name} onChange={e => setName(e.target.value)} required />

      {/* Add from library */}
      <div className="relative">
        <Input
          label="Add ingredient from library"
          placeholder="Search saved items…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {matches.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
            {matches.map(it => (
              <button
                key={it.id}
                type="button"
                onClick={() => addFromLibrary(it)}
                className="w-full flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-gray-900 dark:text-gray-100">{it.name}</span>
                <span className="text-xs text-gray-400 tabular-nums">{Math.round(it.caloriesPer100)} kcal/100g</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Item {i + 1}{item.sourceItemId ? ' · from library' : ''}
              </span>
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

      <Button type="button" variant="secondary" className="w-full" onClick={addBlank}>
        <LuPlus className="w-4 h-4" /> Add ingredient manually
      </Button>

      {err && <p className="text-xs text-gray-500">{err}</p>}

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={busy}>
          {busy ? <Spinner size="sm" /> : <LuSave className="w-4 h-4" />}
          {busy ? 'Saving…' : (submitLabel ?? 'Save Meal')}
        </Button>
      </div>
    </form>
  );
}
