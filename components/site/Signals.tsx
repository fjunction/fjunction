// components/site/Signals.tsx
import { BedDouble, Activity, Hourglass, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  bed: BedDouble,
  activity: Activity,
  hourglass: Hourglass,
}

type SignalCard = {
  id: string
  icon_key: string
  title: string
  description: string | null
}

export function Signals({
  heading,
  subheading,
  cards,
}: {
  heading: string
  subheading?: string | null
  cards: SignalCard[]
}) {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{heading}</h2>
        {subheading && <p className="mt-3 max-w-xl text-sm text-gray-500">{subheading}</p>}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = ICON_MAP[card.icon_key] ?? BedDouble
            return (
              <div key={card.id} className="rounded-xl bg-white p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Icon className="h-5 w-5 text-orange-500" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{card.title}</h3>
                {card.description && (
                  <p className="mt-2 text-sm text-gray-500">{card.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}