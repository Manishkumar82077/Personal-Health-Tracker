'use client';
import { useState } from 'react';
import {
  LuPlus, LuTrash2, LuPencil, LuUtensils, LuChefHat, LuFlame,
} from 'react-icons/lu';
import { addFoodItem, updateFoodItem, deleteFoodItem, deleteMeal } from '@/lib/api';
import { useLibrary } from '@/hooks/useLibrary';
import type { FoodItem, FoodItemInput, Meal } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';
import { FoodItemForm } from '@/components/forms/FoodItemForm';
import { MealForm } from '@/components/forms/MealForm';

type Panel =
  | { type: 'new-item' }
  | { type: 'edit-item'; item: FoodItem }
  | { type: 'new-meal' }
  | { type: 'edit-meal'; meal: Meal }
  | null;

export default function LibraryPage() {
  const { items, meals, loading, refresh } = useLibrary();
  const [panel, setPanel] = useState<Panel>(null);
  const [busy, setBusy] = useState(false);

  const close = () => setPanel(null);
  const afterChange = () => { refresh(); close(); };

  const createItem = async (data: FoodItemInput) => {
    setBusy(true);
    try { await addFoodItem(data); afterChange(); } finally { setBusy(false); }
  };
  const editItem = async (id: string, data: FoodItemInput) => {
    setBusy(true);
    try { await updateFoodItem(id, data); afterChange(); } finally { setBusy(false); }
  };
  const removeItem = async (id: string) => { await deleteFoodItem(id); refresh(); };
  const removeMeal = async (id: string) => { await deleteMeal(id); refresh(); };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader title="Food Library" subtitle="Items & meals you can reuse" backHref="/food" />

      {/* Active form panel */}
      {panel?.type === 'new-item' && (
        <Card className="p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4">New food item</h3>
          <FoodItemForm submitLabel="Save item" busy={busy} onSubmit={createItem} onCancel={close} />
        </Card>
      )}
      {panel?.type === 'edit-item' && (
        <Card className="p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4">Edit {panel.item.name}</h3>
          <FoodItemForm
            initial={panel.item}
            submitLabel="Save changes"
            busy={busy}
            onSubmit={(data) => editItem(panel.item.id, data)}
            onCancel={close}
          />
        </Card>
      )}
      {panel?.type === 'new-meal' && (
        <Card className="p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4">New meal</h3>
          <MealForm libraryItems={items} submitLabel="Save meal" onDone={afterChange} onCancel={close} />
        </Card>
      )}
      {panel?.type === 'edit-meal' && (
        <Card className="p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4">Edit {panel.meal.name}</h3>
          <MealForm initial={panel.meal} libraryItems={items} submitLabel="Save changes" onDone={afterChange} onCancel={close} />
        </Card>
      )}

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {!loading && !panel && (
        <div className="space-y-6">
          {/* Items */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <LuUtensils className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Food Items</h2>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setPanel({ type: 'new-item' })}>
                <LuPlus className="w-3.5 h-3.5" /> New
              </Button>
            </div>
            {items.length === 0 ? (
              <Card className="p-6 text-center text-sm text-gray-400">No saved items yet</Card>
            ) : (
              <div className="space-y-2">
                {items.map(it => (
                  <Card key={it.id} className="p-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">{it.name}</p>
                      <p className="text-xs text-gray-400 tabular-nums">
                        {Math.round(it.caloriesPer100)} kcal/100g · serving {it.defaultQuantity}g
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button onClick={() => setPanel({ type: 'edit-item', item: it })}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <LuPencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeItem(it.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <LuTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Meals */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <LuChefHat className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Meals</h2>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setPanel({ type: 'new-meal' })}>
                <LuPlus className="w-3.5 h-3.5" /> New
              </Button>
            </div>
            {meals.length === 0 ? (
              <Card className="p-6 text-center text-sm text-gray-400">No saved meals yet</Card>
            ) : (
              <div className="space-y-2">
                {meals.map(m => (
                  <Card key={m.id} className="p-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">{m.name}</p>
                      <p className="text-xs text-gray-400 tabular-nums flex items-center gap-1">
                        <LuFlame className="w-3 h-3" />{Math.round(m.totals.calories)} kcal · {m.items.length} items
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button onClick={() => setPanel({ type: 'edit-meal', meal: m })}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <LuPencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeMeal(m.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <LuTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
