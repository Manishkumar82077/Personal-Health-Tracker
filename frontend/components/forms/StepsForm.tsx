'use client';
import { useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { updateSteps } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  date: string;
  current: number;
  onDone: () => void;
}

export function StepsForm({ date, current, onDone }: Props) {
  const [value, setValue] = useState(String(current || ''));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(value);
    if (!count || count < 0) { setErr('Enter a valid step count'); return; }
    setBusy(true);
    setErr('');
    try {
      await updateSteps(date, count);
      onDone();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Input
        label="Step count" type="number" min="0" step="1"
        placeholder="8000" value={value}
        onChange={e => setValue(e.target.value)}
        className="flex-1"
        error={err}
      />
      <Button type="submit" disabled={busy} className="mb-[1px]">
        {busy ? <Spinner size="sm" /> : <LuCheck className="w-4 h-4" />}
        Save
      </Button>
    </form>
  );
}
