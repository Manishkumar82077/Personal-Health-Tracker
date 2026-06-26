import {
  LuFlame, LuZap, LuWheat, LuDroplet, LuLeaf,
  LuDroplets, LuActivity, LuBed, LuDumbbell,
} from 'react-icons/lu';
import type { Dashboard } from '@/lib/types';
import { StatTile } from './ui/StatTile';
import { Card } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

interface Props { data: Dashboard }

function n(v: number, d = 0) { return v.toFixed(d); }

export function DashboardGrid({ data }: Props) {
  const { totals, goals, progress, remaining, workouts } = data;

  return (
    <div className="space-y-3">
      {/* Calories — hero tile */}
      <Card className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <LuFlame className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Calories</p>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-50 leading-none tabular-nums">
              {Math.round(totals.calories).toLocaleString()}
              <span className="text-base font-normal text-gray-400 ml-1.5">kcal</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Goal</p>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 tabular-nums">
              {goals.calorieGoal.toLocaleString()}
            </p>
          </div>
        </div>
        <ProgressBar value={progress.calories} color="bg-orange-500" className="mb-2" />
        <div className="flex justify-between text-xs text-gray-400">
          <span className="tabular-nums">{n(progress.calories * 100)}%</span>
          <span className="tabular-nums">{Math.round(remaining.calories).toLocaleString()} remaining</span>
        </div>
      </Card>

      {/* Macros 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="Protein" icon={<LuZap className="w-3.5 h-3.5" />}
          value={n(totals.protein, 1)} unit="g"
          goal={`${goals.proteinGoal}g`} progress={progress.protein} color="bg-rose-500"
        />
        <StatTile
          label="Carbs" icon={<LuWheat className="w-3.5 h-3.5" />}
          value={n(totals.carbs, 1)} unit="g"
          goal={`${goals.carbsGoal}g`} progress={progress.carbs} color="bg-yellow-500"
        />
        <StatTile
          label="Fat" icon={<LuDroplet className="w-3.5 h-3.5" />}
          value={n(totals.fat, 1)} unit="g"
          goal={`${goals.fatGoal}g`} progress={progress.fat} color="bg-amber-500"
        />
        <StatTile
          label="Fiber" icon={<LuLeaf className="w-3.5 h-3.5" />}
          value={n(totals.fiber, 1)} unit="g"
          goal={`${goals.fiberGoal}g`} progress={progress.fiber} color="bg-emerald-500"
        />
      </div>

      {/* Water */}
      <StatTile
        label="Water" icon={<LuDroplets className="w-3.5 h-3.5" />}
        value={Math.round(totals.waterMl).toLocaleString()} unit="ml"
        goal={`${goals.waterGoalMl.toLocaleString()} ml`}
        progress={progress.water} color="bg-blue-500"
      />

      {/* Steps + Sleep */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="Steps" icon={<LuActivity className="w-3.5 h-3.5" />}
          value={totals.steps.toLocaleString()}
          goal={goals.stepGoal.toLocaleString()}
          progress={progress.steps} color="bg-teal-500"
        />
        <StatTile
          label="Sleep" icon={<LuBed className="w-3.5 h-3.5" />}
          value={n(totals.sleepHours, 1)} unit="h"
          goal={`${goals.sleepGoalHours}h`}
          progress={progress.sleep} color="bg-violet-500"
        />
      </div>

      {/* Workouts */}
      {workouts.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <LuDumbbell className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Workouts Today</p>
          </div>
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {workouts.map(w => (
              <li key={w.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{w.exercise}</span>
                <span className="text-xs text-gray-400 tabular-nums">
                  {w.sets}×{w.reps} @ {w.weightKg}kg
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
