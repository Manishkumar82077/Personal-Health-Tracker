'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuHouse, LuUtensils, LuDroplets, LuDumbbell, LuActivity, LuMoon, LuUsers } from 'react-icons/lu';

const NAV = [
  { href: '/dashboard', Icon: LuHouse,     label: 'Home'      },
  { href: '/food',      Icon: LuUtensils,  label: 'Food'      },
  { href: '/water',     Icon: LuDroplets,  label: 'Water'     },
  { href: '/workout',   Icon: LuDumbbell,  label: 'Workout'   },
  { href: '/steps',     Icon: LuActivity,  label: 'Steps'     },
  { href: '/sleep',     Icon: LuMoon,      label: 'Sleep'     },
  { href: '/community', Icon: LuUsers,     label: 'Community' },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="flex">
        {NAV.map(({ href, Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${
                active
                  ? 'text-gray-900 dark:text-gray-50'
                  : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-2' : 'stroke-[1.5]'}`} />
              <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
