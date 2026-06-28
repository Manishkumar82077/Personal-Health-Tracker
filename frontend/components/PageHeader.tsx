import { ReactNode } from 'react';
import Link from 'next/link';
import { LuChevronLeft } from 'react-icons/lu';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, backHref, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          >
            <LuChevronLeft className="w-5 h-5" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 leading-none">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0 ml-3">{action}</div>}
    </div>
  );
}
