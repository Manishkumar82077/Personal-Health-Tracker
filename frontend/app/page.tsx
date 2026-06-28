'use client';
import Link from 'next/link';
import {
  LuHeartPulse, LuUtensils, LuDroplets, LuDumbbell,
  LuActivity, LuMoon, LuArrowRight, LuTarget, LuChartLine,
  LuPencil, LuLayoutDashboard,
} from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ThemeToggle';

const FEATURES = [
  { Icon: LuUtensils,  label: 'Food & macros', desc: 'Calories, protein, carbs, fat & fiber' },
  { Icon: LuDroplets,  label: 'Water intake',  desc: 'Stay hydrated against a daily goal' },
  { Icon: LuDumbbell,  label: 'Workouts',      desc: 'Log sets, reps and weight' },
  { Icon: LuActivity,  label: 'Steps',         desc: 'Track daily movement' },
  { Icon: LuMoon,      label: 'Sleep',         desc: 'Hours of rest each night' },
  { Icon: LuTarget,    label: 'Goals',         desc: 'Personal targets for every metric' },
];

const STEPS = [
  { Icon: LuPencil,          title: 'Log it', desc: 'Add your meals, water, workouts, steps and sleep in seconds.' },
  { Icon: LuLayoutDashboard, title: 'See it', desc: 'Your day rolls up into one clean dashboard with live progress.' },
  { Icon: LuChartLine,       title: 'Improve', desc: 'Compare against your goals and build healthier habits over time.' },
];

export default function LandingPage() {
  const { user, mockMode } = useAuth();
  const authed = mockMode || !!user;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-900 dark:bg-gray-50">
              <LuHeartPulse className="w-4.5 h-4.5 text-white dark:text-gray-900" />
            </span>
            <span className="font-bold text-gray-900 dark:text-gray-50">Health Tracker</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            {authed ? (
              <Link href="/dashboard"
                className="text-sm font-medium px-3.5 py-1.5 rounded-xl bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 hover:opacity-90 transition-opacity">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login"
                  className="text-sm font-medium px-3.5 py-1.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Sign in
                </Link>
                <Link href="/signup"
                  className="text-sm font-medium px-3.5 py-1.5 rounded-xl bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 hover:opacity-90 transition-opacity">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full px-3 py-1">
            <LuHeartPulse className="w-3.5 h-3.5" /> Your personal health dashboard
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Track every part of your day in one place
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Food, water, workouts, steps and sleep — logged in seconds and rolled
            up into a single, clear dashboard so you always know where you stand.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={authed ? '/dashboard' : '/signup'}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 font-medium rounded-xl px-6 py-3 hover:opacity-90 transition-opacity"
            >
              {authed ? 'Go to dashboard' : 'Get started — it’s free'}
              <LuArrowRight className="w-4 h-4" />
            </Link>
            {!authed && (
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-50">
            Everything you need to track
          </h2>
          <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
            One app for all of your daily health metrics.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map(({ Icon, label, desc }) => (
              <div
                key={label}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-50">{label}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-50">How it works</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STEPS.map(({ Icon, title, desc }, i) => (
              <div key={title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 text-sm font-bold">
                    {i + 1}
                  </span>
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-50">{title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        {!authed && (
          <section className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-gray-900 dark:bg-gray-50 rounded-3xl px-6 py-10 text-center">
              <h2 className="text-2xl font-bold text-white dark:text-gray-900">Start tracking today</h2>
              <p className="mt-2 text-gray-300 dark:text-gray-600">
                Create a free account and build healthier habits one day at a time.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-medium rounded-xl px-6 py-3 hover:opacity-90 transition-opacity"
              >
                Create your account
                <LuArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <LuHeartPulse className="w-4 h-4" />
            <span className="text-sm">Health Tracker</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Health Tracker. Built for your wellbeing.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/login" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
