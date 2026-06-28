'use client';
import Link from 'next/link';
import {
  LuHeartPulse, LuUtensils, LuDroplets, LuDumbbell, LuActivity, LuMoon,
  LuArrowRight, LuTarget, LuChartLine, LuPencil, LuLayoutDashboard,
  LuSearch, LuUsers, LuMessageCircle, LuSunMoon, LuShieldCheck, LuSmartphone,
  LuFlame, LuCheck,
} from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ThemeToggle';

const TRACKERS = [
  { Icon: LuUtensils,  label: 'Food & macros', desc: 'Calories, protein, carbs, fat & fiber per meal' },
  { Icon: LuDroplets,  label: 'Water intake',  desc: 'Log glasses and hit your daily hydration goal' },
  { Icon: LuDumbbell,  label: 'Workouts',      desc: 'Sets, reps and weight for every exercise' },
  { Icon: LuActivity,  label: 'Steps',         desc: 'Daily movement against your step target' },
  { Icon: LuMoon,      label: 'Sleep',         desc: 'Bed and wake times, hours of rest' },
  { Icon: LuTarget,    label: 'Goals',         desc: 'Personal targets for every single metric' },
];

const STATS = [
  { value: '200+', label: 'foods in the shared library' },
  { value: '6',    label: 'metrics tracked daily' },
  { value: '1',    label: 'clean dashboard for it all' },
  { value: 'Free', label: 'to create an account' },
];

const EXTRAS = [
  { Icon: LuSunMoon,    title: 'Light & dark mode', desc: 'A built-in theme toggle — light, dark, or follow your system.' },
  { Icon: LuShieldCheck, title: 'Secure sign-in',   desc: 'Email & password auth with password reset, powered by Firebase.' },
  { Icon: LuSmartphone, title: 'Works everywhere',  desc: 'A fast, mobile-first design that feels great on any screen.' },
];

const STEPS = [
  { Icon: LuPencil,          title: 'Log it',  desc: 'Add meals, water, workouts, steps and sleep in seconds.' },
  { Icon: LuLayoutDashboard, title: 'See it',  desc: 'Your day rolls up into one dashboard with live progress.' },
  { Icon: LuChartLine,       title: 'Improve', desc: 'Track against your goals and build healthier habits.' },
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
                  Login
                </Link>
                <Link href="/signup"
                  className="text-sm font-medium px-3.5 py-1.5 rounded-xl bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 hover:opacity-90 transition-opacity">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full px-3 py-1">
            <LuHeartPulse className="w-3.5 h-3.5" /> Your personal health dashboard
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Track every part of your day in one place
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Food, water, workouts, steps and sleep — logged in seconds and rolled
            up into a single, clear dashboard, with a shared food library and a
            community to keep you going.
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

        {/* Stats band */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map(s => (
              <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{s.value}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trackers */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-50">Everything you need to track</h2>
          <p className="mt-2 text-center text-gray-500 dark:text-gray-400">Six core metrics, one consistent experience.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRACKERS.map(({ Icon, label, desc }) => (
              <div key={label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-50">{label}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Highlight: Dashboard */}
        <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <LuLayoutDashboard className="w-4 h-4" /> Daily dashboard
            </span>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-50">Your whole day, at a glance</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Calories and macros, water, steps, sleep and workouts roll up for any
              date — each with a live progress bar against the goals you set.
            </p>
            <ul className="mt-4 space-y-2">
              {['Pick any date and see that day’s totals', 'Progress bars vs. your personal goals', 'Macros, hydration, activity & rest in one view'].map(t => (
                <li key={t} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <LuCheck className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          {/* Mock dashboard */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <LuFlame className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Calories</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-50 tabular-nums">1,640<span className="text-sm font-normal text-gray-400 ml-1">/ 2,000 kcal</span></p>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 mt-2 overflow-hidden"><div className="h-full w-[82%] bg-orange-500" /></div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[['Protein', 'bg-rose-500', '78%'], ['Carbs', 'bg-yellow-500', '64%'], ['Fat', 'bg-amber-500', '55%']].map(([l, c, w]) => (
                <div key={l} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400">{l}</p>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mt-2 overflow-hidden"><div className={`h-full ${c}`} style={{ width: w }} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Highlight: Food library */}
        <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          {/* Mock search */}
          <div className="order-2 md:order-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-400">
              <LuSearch className="w-4 h-4" /> roti
            </div>
            <div className="mt-3 space-y-2">
              {[['Roti / Chapati', 'Item', '297 kcal/100g'], ['Rice + Dal', 'Meal', '623 kcal'], ['Boiled Egg', 'Item', '155 kcal/100g']].map(([n, tag, kc]) => (
                <div key={n} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                  <span className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100">
                    {n}
                    <span className="text-[10px] uppercase font-semibold text-gray-400 bg-white dark:bg-gray-900 rounded px-1.5 py-0.5">{tag}</span>
                  </span>
                  <span className="text-xs text-gray-400 tabular-nums">{kc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <LuSearch className="w-4 h-4" /> Shared food library
            </span>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-50">Search first, never type twice</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              A growing catalog of 200+ foods and meals shared by everyone. Search to
              find and log instantly — or create a new item once and it’s there for
              good. Built-in duplicate prevention keeps the list clean.
            </p>
            <ul className="mt-4 space-y-2">
              {['200+ ready-to-log foods & meals', 'Build meals from multiple items', 'Log to any day with one tap'].map(t => (
                <li key={t} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <LuCheck className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Highlight: Community */}
        <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <LuUsers className="w-4 h-4" /> Community
            </span>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-50">Stay motivated, together</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              A Telegram-style group chat where you share wins and ask questions.
              React with emojis, reply to any message, and tap a name to see that
              person’s public profile.
            </p>
            <ul className="mt-4 space-y-2">
              {['Live-feeling chat feed', 'Emoji reactions & threaded replies', 'Public profiles — your posts, never your private data'].map(t => (
                <li key={t} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <LuCheck className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          {/* Mock chat */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">P</div>
              <div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-3 py-2 text-sm text-gray-800 dark:text-gray-100">Hit my 10k steps 7 days in a row! 🎉</div>
                <div className="flex gap-1 mt-1">
                  <span className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5">🔥 3</span>
                  <span className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5">💪 1</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row-reverse gap-2">
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl rounded-br-md px-3 py-2 text-sm max-w-[80%]">Amazing — keep it up! 👍</div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-400">
              <LuMessageCircle className="w-4 h-4" /> Message the community…
            </div>
          </div>
        </section>

        {/* Extras */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EXTRAS.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-50">{title}</h3>
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
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 text-sm font-bold">{i + 1}</span>
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
              <p className="mt-2 text-gray-300 dark:text-gray-600">Create a free account and build healthier habits one day at a time.</p>
              <Link href="/signup"
                className="mt-6 inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-medium rounded-xl px-6 py-3 hover:opacity-90 transition-opacity">
                Create your account <LuArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-900 dark:bg-gray-50">
                <LuHeartPulse className="w-4.5 h-4.5 text-white dark:text-gray-900" />
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-50">Health Tracker</span>
            </div>
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 max-w-[16rem]">
              Track food, water, workouts, steps and sleep — all in one place.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Product</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/dashboard" className="hover:text-gray-900 dark:hover:text-gray-50">Dashboard</Link></li>
              <li><Link href="/library" className="hover:text-gray-900 dark:hover:text-gray-50">Food library</Link></li>
              <li><Link href="/community" className="hover:text-gray-900 dark:hover:text-gray-50">Community</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Track</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/food" className="hover:text-gray-900 dark:hover:text-gray-50">Food</Link></li>
              <li><Link href="/water" className="hover:text-gray-900 dark:hover:text-gray-50">Water</Link></li>
              <li><Link href="/workout" className="hover:text-gray-900 dark:hover:text-gray-50">Workouts</Link></li>
              <li><Link href="/steps" className="hover:text-gray-900 dark:hover:text-gray-50">Steps</Link></li>
              <li><Link href="/sleep" className="hover:text-gray-900 dark:hover:text-gray-50">Sleep</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Account</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/login" className="hover:text-gray-900 dark:hover:text-gray-50">Login</Link></li>
              <li><Link href="/signup" className="hover:text-gray-900 dark:hover:text-gray-50">Sign up</Link></li>
              <li><Link href="/settings" className="hover:text-gray-900 dark:hover:text-gray-50">Settings</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800">
          <p className="max-w-5xl mx-auto px-4 py-5 text-xs text-gray-400 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} Health Tracker. Built for your wellbeing.
          </p>
        </div>
      </footer>
    </div>
  );
}
