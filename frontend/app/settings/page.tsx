'use client';
import { useState, useEffect } from 'react';
import { LuCheck, LuTarget, LuScale, LuUser, LuLogOut } from 'react-icons/lu';
import { updateProfile } from '@/lib/api';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';
import type { Goals } from '@/lib/types';

type FormState = Omit<Goals, never> & { weightKg: string; displayName: string };

export default function SettingsPage() {
  const { profile, loading, refresh } = useProfile();
  const { signOut } = useAuth();

  const [form, setForm] = useState<FormState>({
    calorieGoal: 2000, proteinGoal: 120, carbsGoal: 250,
    fatGoal: 65, fiberGoal: 30, waterGoalMl: 3000,
    stepGoal: 10000, sleepGoalHours: 8,
    weightKg: '', displayName: '',
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        calorieGoal:    profile.goals.calorieGoal,
        proteinGoal:    profile.goals.proteinGoal,
        carbsGoal:      profile.goals.carbsGoal,
        fatGoal:        profile.goals.fatGoal,
        fiberGoal:      profile.goals.fiberGoal,
        waterGoalMl:    profile.goals.waterGoalMl,
        stepGoal:       profile.goals.stepGoal,
        sleepGoalHours: profile.goals.sleepGoalHours,
        weightKg:       profile.weightKg ? String(profile.weightKg) : '',
        displayName:    profile.displayName ?? '',
      });
    }
  }, [profile]);

  const setField = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: typeof prev[k] === 'number' ? Number(e.target.value) || 0 : e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    setSaved(false);
    try {
      await updateProfile({
        calorieGoal:    form.calorieGoal,
        proteinGoal:    form.proteinGoal,
        carbsGoal:      form.carbsGoal,
        fatGoal:        form.fatGoal,
        fiberGoal:      form.fiberGoal,
        waterGoalMl:    form.waterGoalMl,
        stepGoal:       form.stepGoal,
        sleepGoalHours: form.sleepGoalHours,
        ...(form.weightKg ? { weightKg: Number(form.weightKg) } : {}),
        ...(form.displayName ? { displayName: form.displayName } : {}),
      });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <PageHeader title="Settings" backHref="/" />
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader title="Settings" subtitle="Goals & profile" backHref="/" />

      <form onSubmit={handleSave} className="space-y-4">
        {/* Profile */}
        <Card className="p-4">
          <div className="flex items-center gap-1.5 mb-4">
            <LuUser className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Profile</p>
          </div>
          <div className="space-y-3">
            <Input label="Display Name" placeholder="Your name" value={form.displayName}
              onChange={setField('displayName')} />
            <Input label="Weight (kg)" type="number" min="0" step="0.1" placeholder="75"
              value={form.weightKg} onChange={setField('weightKg')} />
          </div>
        </Card>

        {/* Nutrition goals */}
        <Card className="p-4">
          <div className="flex items-center gap-1.5 mb-4">
            <LuTarget className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Nutrition Goals</p>
          </div>
          <div className="space-y-3">
            <Input label="Calories (kcal/day)" type="number" min="0" step="50"
              value={String(form.calorieGoal)} onChange={setField('calorieGoal')} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Protein (g)" type="number" min="0" step="5"
                value={String(form.proteinGoal)} onChange={setField('proteinGoal')} />
              <Input label="Carbs (g)" type="number" min="0" step="5"
                value={String(form.carbsGoal)} onChange={setField('carbsGoal')} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Fat (g)" type="number" min="0" step="5"
                value={String(form.fatGoal)} onChange={setField('fatGoal')} />
              <Input label="Fiber (g)" type="number" min="0" step="1"
                value={String(form.fiberGoal)} onChange={setField('fiberGoal')} />
            </div>
          </div>
        </Card>

        {/* Activity goals */}
        <Card className="p-4">
          <div className="flex items-center gap-1.5 mb-4">
            <LuScale className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Activity Goals</p>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input label="Water (ml/day)" type="number" min="0" step="250"
                value={String(form.waterGoalMl)} onChange={setField('waterGoalMl')} />
              <Input label="Steps/day" type="number" min="0" step="500"
                value={String(form.stepGoal)} onChange={setField('stepGoal')} />
            </div>
            <Input label="Sleep goal (hours)" type="number" min="0" max="24" step="0.5"
              value={String(form.sleepGoalHours)} onChange={setField('sleepGoalHours')} />
          </div>
        </Card>

        {err && <p className="text-xs text-gray-500 px-1">{err}</p>}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Spinner size="sm" /> : saved ? <LuCheck className="w-4 h-4" /> : null}
          {busy ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button variant="ghost" className="w-full text-gray-400" onClick={() => signOut()}>
          <LuLogOut className="w-4 h-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
