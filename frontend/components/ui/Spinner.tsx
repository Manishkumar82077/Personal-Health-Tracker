interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'h-4 w-4 border', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-2' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-gray-100 ${sizes[size]} ${className}`}
    />
  );
}
