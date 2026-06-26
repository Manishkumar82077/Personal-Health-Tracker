import { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

const baseInput =
  'w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ' +
  'px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-colors';

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input id={id} className={`${baseInput} ${error ? 'border-gray-900' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-gray-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, id, className = '', children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select id={id} className={`${baseInput} ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-gray-500">{error}</p>}
    </div>
  );
}
