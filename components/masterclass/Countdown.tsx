// components/masterclass/Countdown.tsx
'use client'

import { useEffect, useState } from 'react'

const LABELS = ['Days', 'Hrs', 'Min', 'Sec']
const pad = (n: number) => String(n).padStart(2, '0')

export function Countdown({ target, size = 'sm' }: { target: string; size?: 'sm' | 'lg' }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = now === null ? null : Math.max(0, new Date(target).getTime() - now)
  const parts =
    diff === null
      ? ['--', '--', '--', '--']
      : [
          Math.floor(diff / 86400000),
          Math.floor(diff / 3600000) % 24,
          Math.floor(diff / 60000) % 60,
          Math.floor(diff / 1000) % 60,
        ].map(pad)

  const large = size === 'lg'

  return (
    <div className="flex items-center gap-1.5">
      {parts.map((part, i) => (
        <div
          key={LABELS[i]}
          className={`rounded-md border border-slate-700 bg-slate-900 text-center ${large ? 'min-w-[60px] px-2 py-2' : 'min-w-[34px] px-1.5 py-1'}`}
        >
          <div className={`font-mono font-bold text-amber-500 ${large ? 'text-2xl' : 'text-xs'}`}>{part}</div>
          <div className={`uppercase tracking-wide text-slate-500 ${large ? 'text-[10px]' : 'text-[8px]'}`}>{LABELS[i]}</div>
        </div>
      ))}
    </div>
  )
}