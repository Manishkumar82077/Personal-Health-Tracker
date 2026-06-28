'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  LuPlus, LuTrash2, LuUtensils, LuChefHat,
  LuChevronLeft, LuChevronRight, LuZap, LuWheat, LuDroplet,
} from 'react-icons/lu';
import { today, formatDisplay, toDateString } from '@/lib/date';
import { deleteFood } from '@/lib/api';
import { useFood } from '@/hooks/useFood';
import { AddFoodSheet } from '@/components/AddFoodSheet';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

export default function FoodPage() {
  const [date, setDate] = useState(today());
  const [showSheet, setShowSheet] = useState(false);
  const { entries, loading, refresh } = useFood(date);
  const isToday = date === today();

  const shiftDay = (d: number) => {
    const dt = new Date(date + 'T00:00:00');
    dt.setDate(dt.getDate() + d);
    setDate(toDateString(dt));
  };

  const handleDelete = async (id: string) => {
    await deleteFood(id);
    refresh();
  };

  const totalCal = entries.reduce((s, e) => s + e.calories, 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader
        title="Food"
        subtitle={`${formatDisplay(date)} · ${Math.round(totalCal)} kcal`}
        action={
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => shiftDay(-1)}>
              <LuChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDate(today())} disabled={isToday}>Today</Button>
            <Button variant="ghost" size="sm" onClick={() => shiftDay(1)} disabled={isToday}>
              <LuChevronRight className="w-4 h-4" />
            </Button>
            <Link
              href="/library"
              className="flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Food library"
            >
              <LuChefHat className="w-4 h-4" />
            </Link>
          </div>
        }
      />

      <Button className="w-full mb-4" onClick={() => setShowSheet(true)}>
        <LuPlus className="w-4 h-4" /> Add Food
      </Button>

      {showSheet && (
        <AddFoodSheet date={date} onClose={() => setShowSheet(false)} onLogged={refresh} />
      )}

      {loading && (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      )}

      {!loading && entries.length === 0 && (
        <Card className="p-8 text-center">
          <LuUtensils className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No food logged {isToday ? 'today' : 'this day'}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tap &ldquo;Add Food Entry&rdquo; to get started</p>
        </Card>
      )}

      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map(entry => (
            <Card key={entry.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">{entry.name}</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200 tabular-nums ml-2">
                      {Math.round(entry.calories)} kcal
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="tabular-nums">{entry.quantity}g</span>
                    <span className="flex items-center gap-0.5">
                      <LuZap className="w-3 h-3" />{entry.protein.toFixed(1)}g
                    </span>
                    <span className="flex items-center gap-0.5">
                      <LuWheat className="w-3 h-3" />{entry.carbs.toFixed(1)}g
                    </span>
                    <span className="flex items-center gap-0.5">
                      <LuDroplet className="w-3 h-3" />{entry.fat.toFixed(1)}g
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors shrink-0 mt-0.5"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}

          {/* Totals row */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Day Total</p>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-300 tabular-nums">
                <span>{Math.round(totalCal)} kcal</span>
                <span className="text-gray-400">·</span>
                <span>P {entries.reduce((s, e) => s + e.protein, 0).toFixed(1)}g</span>
                <span>C {entries.reduce((s, e) => s + e.carbs, 0).toFixed(1)}g</span>
                <span>F {entries.reduce((s, e) => s + e.fat, 0).toFixed(1)}g</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
