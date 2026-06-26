import { ReactNode } from 'react';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface StatTileProps {
  label: string;
  value: number | string;
  goal?: number | string;
  progress?: number;
  unit?: string;
  color?: string;
  icon?: ReactNode;
}

export function StatTile({ label, value, goal, progress, unit = '', color, icon }: StatTileProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {icon && (
              <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">{icon}</span>
            )}
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate">
              {label}
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 leading-none">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && (
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">{unit}</span>
            )}
          </p>
        </div>
        {goal !== undefined && (
          <p className="text-xs text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0 mt-0.5">
            /{typeof goal === 'number' ? goal.toLocaleString() : goal}
          </p>
        )}
      </div>
      {progress !== undefined && <ProgressBar value={progress} color={color} />}
    </Card>
  );
}
