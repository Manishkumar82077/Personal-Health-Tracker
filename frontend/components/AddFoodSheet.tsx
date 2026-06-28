'use client';
import { useState } from 'react';
import {
  LuSearch, LuX, LuPlus, LuUtensils, LuChefHat, LuArrowLeft, LuCheck,
} from 'react-icons/lu';
import { addFoodItem, logFoodItem, logMeal } from '@/lib/api';
import type { FoodItem, FoodItemInput, Meal } from '@/lib/types';
import { useLibrary } from '@/hooks/useLibrary';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { FoodItemForm } from '@/components/forms/FoodItemForm';
import { MealForm } from '@/components/forms/MealForm';

interface Props {
  date: string;
  onClose: () => void;
  onLogged: () => void;
}

type Mode = 'search' | 'new-item' | 'new-meal';

export function AddFoodSheet({ date, onClose, onLogged }: Props) {
  const { items, meals, loading, refresh } = useLibrary();
  const [mode, setMode] = useState<Mode>('search');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [qty, setQty] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const needle = query.trim().toLowerCase();
  const itemMatches = needle ? items.filter(i => i.name.toLowerCase().includes(needle)) : items;
  const mealMatches = needle ? meals.filter(m => m.name.toLowerCase().includes(needle)) : meals;
  const noResults = needle.length > 0 && itemMatches.length === 0 && mealMatches.length === 0;

  const finish = () => { onLogged(); onClose(); };

  const selectItem = (it: FoodItem) => {
    setSelectedId(it.id);
    setQty(String(it.defaultQuantity || 100));
  };

  const logItem = async (it: FoodItem) => {
    setBusyId(it.id);
    try {
      await logFoodItem(it.id, date, Number(qty) || it.defaultQuantity);
      refresh();
      finish();
    } finally {
      setBusyId(null);
    }
  };

  const logMealNow = async (m: Meal) => {
    setBusyId(m.id);
    try {
      await logMeal(m.id, date);
      finish();
    } finally {
      setBusyId(null);
    }
  };

  const createAndLogItem = async (data: FoodItemInput) => {
    setBusy(true);
    try {
      const created = await addFoodItem(data);
      await logFoodItem(created.id, date, created.defaultQuantity);
      refresh();
      finish();
    } finally {
      setBusy(false);
    }
  };

  const createAndLogMeal = async (meal?: Meal) => {
    if (!meal) return;
    setBusy(true);
    try {
      await logMeal(meal.id, date);
      refresh();
      finish();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-gray-50 dark:bg-gray-950 rounded-t-3xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {mode !== 'search' && (
              <button onClick={() => setMode('search')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <LuArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">
              {mode === 'search' ? 'Add food' : mode === 'new-item' ? 'New item' : 'New meal'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {mode === 'search' && (
          <>
            <div className="relative mb-4">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                autoFocus
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedId(null); }}
                placeholder="Search foods & meals…"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              />
            </div>

            {loading && <div className="flex justify-center py-8"><Spinner size="lg" /></div>}

            {!loading && (
              <div className="space-y-2">
                {/* Items */}
                {itemMatches.map(it => (
                  <div key={it.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                    <button onClick={() => selectItem(it)} className="w-full flex items-center justify-between text-left">
                      <div className="flex items-center gap-2 min-w-0">
                        <LuUtensils className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{it.name}</span>
                        <span className="text-[10px] uppercase font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5">Item</span>
                      </div>
                      <span className="text-xs text-gray-400 tabular-nums ml-2 flex-shrink-0">{Math.round(it.caloriesPer100)} kcal/100g</span>
                    </button>

                    {selectedId === it.id && (
                      <div className="flex items-end gap-2 mt-3">
                        <Input
                          label="Quantity (g)" type="number" min="0" step="any"
                          value={qty} onChange={e => setQty(e.target.value)} className="flex-1"
                        />
                        <Button size="md" onClick={() => logItem(it)} disabled={busyId === it.id}>
                          {busyId === it.id ? <Spinner size="sm" /> : <LuCheck className="w-4 h-4" />}
                          Log
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Meals */}
                {mealMatches.map(m => (
                  <div key={m.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <LuChefHat className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{m.name}</span>
                          <span className="text-[10px] uppercase font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5">Meal</span>
                        </div>
                        <span className="text-xs text-gray-400 tabular-nums">{Math.round(m.totals.calories)} kcal · {m.items.length} items</span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => logMealNow(m)} disabled={busyId === m.id}>
                      {busyId === m.id ? <Spinner size="sm" /> : 'Log'}
                    </Button>
                  </div>
                ))}

                {noResults && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                    No match for &ldquo;{query}&rdquo;. Create it below.
                  </p>
                )}
              </div>
            )}

            {/* Create new */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="secondary" onClick={() => setMode('new-item')}>
                <LuPlus className="w-4 h-4" /> New item
              </Button>
              <Button variant="secondary" onClick={() => setMode('new-meal')}>
                <LuPlus className="w-4 h-4" /> New meal
              </Button>
            </div>
          </>
        )}

        {mode === 'new-item' && (
          <FoodItemForm
            initial={query.trim() ? { name: query.trim() } : undefined}
            submitLabel="Save & log"
            busy={busy}
            onSubmit={createAndLogItem}
            onCancel={() => setMode('search')}
          />
        )}

        {mode === 'new-meal' && (
          <MealForm
            libraryItems={items}
            submitLabel="Save & log meal"
            onDone={createAndLogMeal}
            onCancel={() => setMode('search')}
          />
        )}
      </div>
    </div>
  );
}
