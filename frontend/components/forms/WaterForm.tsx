'use client';
import { useState } from 'react';
import { LuPlus, LuDroplets } from 'react-icons/lu';
import { addWater } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

const PRESETS = [150, 250, 350, 500, 750];

interface Props {
  date: string;
  onDone: () => void;
}

export function WaterForm({ date, onDone }: Props) {
  const [custom, setCustom] = useState('');
  const [busy, setBusy] = useState(false);

  const log = async (ml: number) => {
    if (!ml || ml <= 0) return;
    setBusy(true);
    try {
      await addWater({ amountMl: ml, date });
      setCustom('');
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2">
        {PRESETS.map(ml => (
          <button
            key={ml}
            disabled={busy}
            onClick={() => log(ml)}
            className="flex flex-col items-center py-3 rounded-xl border border-gray-100 dark:border-gray-800
              bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800
              text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-40"
          >
            <LuDroplets className="w-4 h-4 mb-1 text-gray-400" />
            <span className="text-xs font-semibold">{ml}</span>
            <span className="text-[10px] text-gray-400">ml</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Custom ml"
          type="number" min="1" step="1"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          className="flex-1"
        />
        <Button onClick={() => log(Number(custom))} disabled={busy || !custom}>
          {busy ? <Spinner size="sm" /> : <LuPlus className="w-4 h-4" />}
          Add
        </Button>
      </div>
    </div>
  );
}
