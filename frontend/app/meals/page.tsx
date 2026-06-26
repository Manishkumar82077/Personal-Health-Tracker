'use client';
import { useState } from 'react';
import {
  LuPlus, LuTrash2, LuChefHat, LuCheck,
  LuZap, LuWheat, LuDroplet, LuFlame,
} from 'react-icons/lu';
import { today } from '@/lib/date';
import { deleteMeal, logMeal } from '@/lib/api';
import { useMeals } from '@/hooks/useMeals';
import { MealForm } from '@/components/forms/MealForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

export default function MealsPage() {
  const [showForm, setShowForm] = useState(false);
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const [loggedId, setLoggedId] = useState<string | null>(null);
  const { meals, loading, refresh } = useMeals();

  const handleDelete = async (id: string) => {
    await deleteMeal(id);
    refresh();
  };

  const handleLog = async (id: string) => {
    setLoggingId(id);
    try {
      await logMeal(id, today());
      setLoggedId(id);
      setTimeout(() => setLoggedId(null), 2000);
    } finally {
      setLoggingId(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader title="Saved Meals" backHref="/food" />

      {showForm ? (
        <MealForm onDone={() => { refresh(); setShowForm(false); }} />
      ) : (
        <Button className="w-full mb-4" onClick={() => setShowForm(true)}>
          <LuPlus className="w-4 h-4" /> Create Meal Template
        </Button>
      )}

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {!loading && meals.length === 0 && (
        <Card className="p-8 text-center">
          <LuChefHat className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No saved meals yet</p>
          <p className="text-xs text-gray-400 mt-1">Create a template to quickly log recurring meals</p>
        </Card>
      )}

      {meals.length > 0 && (
        <div className="space-y-3">
          {meals.map(meal => (
            <Card key={meal.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{meal.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{meal.items.length} ingredient{meal.items.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => handleDelete(meal.id)}
                  className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3 tabular-nums">
                <span className="flex items-center gap-1">
                  <LuFlame className="w-3 h-3" />{Math.round(meal.totals.calories)} kcal
                </span>
                <span className="flex items-center gap-1">
                  <LuZap className="w-3 h-3" />P {meal.totals.protein.toFixed(1)}g
                </span>
                <span className="flex items-center gap-1">
                  <LuWheat className="w-3 h-3" />C {meal.totals.carbs.toFixed(1)}g
                </span>
                <span className="flex items-center gap-1">
                  <LuDroplet className="w-3 h-3" />F {meal.totals.fat.toFixed(1)}g
                </span>
              </div>

              <Button
                variant={loggedId === meal.id ? 'secondary' : 'primary'}
                size="sm"
                className="w-full"
                onClick={() => handleLog(meal.id)}
                disabled={loggingId === meal.id}
              >
                {loggingId === meal.id ? (
                  <><Spinner size="sm" /> Logging…</>
                ) : loggedId === meal.id ? (
                  <><LuCheck className="w-4 h-4" /> Logged to Today</>
                ) : (
                  <>Log to Today</>
                )}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
