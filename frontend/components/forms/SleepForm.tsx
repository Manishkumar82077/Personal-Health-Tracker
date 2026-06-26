'use client';
import { useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { updateSleep } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  date: string;
  current: { sleepTime: string; wakeTime: string } | null;
  onDone: () => void;
}

export function SleepForm({ date, current, onDone }: Props) {
  const [sleepTime, setSleepTime] = useState(current?.sleepTime ?? '23:00');
  const [wakeTime, setWakeTime] = useState(current?.wakeTime ?? '07:00');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await updateSleep(date, { sleepTime, wakeTime });
      onDone();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Bedtime" type="time"
          value={sleepTime} onChange={e => setSleepTime(e.target.value)} required
        />
        <Input
          label="Wake time" type="time"
          value={wakeTime} onChange={e => setWakeTime(e.target.value)} required
        />
      </div>
      {err && <p className="text-xs text-gray-500">{err}</p>}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? <Spinner size="sm" /> : <LuCheck className="w-4 h-4" />}
        {busy ? 'Saving…' : 'Save Sleep'}
      </Button>
    </form>
  );
}
