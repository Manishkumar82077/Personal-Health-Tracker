interface ProgressBarProps {
  value: number; // 0..1
  color?: string;
  className?: string;
}

export function ProgressBar({ value, color = 'bg-gray-900', className = '' }: ProgressBarProps) {
  const pct = Math.min(1, Math.max(0, value)) * 100;
  return (
    <div className={`w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden ${className}`}>
      <div
        className={`h-1.5 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
