// components/site/Signals.tsx
import { BatteryLow, Activity, Scale, Droplet, FlaskConical, FileQuestion, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  battery: BatteryLow, activity: Activity, scale: Scale, droplet: Droplet, flask: FlaskConical, 'file-question': FileQuestion,
}

type SignalCard = { id: string; icon_key: string; title: string; description: string | null }

export function Signals({
  heading, headingSecondary, subheading, cards,
}: { heading: string; headingSecondary?: string | null; subheading?: string | null; cards: SignalCard[] }) {
  return (
    <section className="bg-neutral-950 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {heading}
          {headingSecondary && <span className="block text-neutral-500">{headingSecondary}</span>}
        </h2>
        {subheading && <p className="mt-3 max-w-xl text-sm text-neutral-400">{subheading}</p>}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = ICON_MAP[card.icon_key] ?? BatteryLow
            return (
              <div key={card.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                  <Icon className="h-5 w-5 text-orange-500" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
                {card.description && <p className="mt-2 text-sm text-neutral-400">{card.description}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}