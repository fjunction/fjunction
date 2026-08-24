// components/site/ProtocolSection.tsx
import Image from 'next/image'
import { TrendingUp, SlidersHorizontal, Dna, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = { 'trending-up': TrendingUp, sliders: SlidersHorizontal, dna: Dna }

// Fixed bento layout by card position — matches the design's asymmetric grid
const COL_SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

type Card = {
  id: string
  icon_key: string
  title: string
  description: string | null
  widget_type: 'none' | 'tags' | 'image'
  widget_items: string | null
  image_url: string | null
}

export function ProtocolSection({ heading, subheading, cards }: { heading: string; subheading?: string | null; cards: Card[] }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{heading}</h2>
        {subheading && <p className="mt-3 text-sm text-gray-500">{subheading}</p>}

        <div className="mt-10 grid gap-6 md:grid-cols-12">
          {cards.map((card, index) => {
            const Icon = ICON_MAP[card.icon_key] ?? TrendingUp
            const tags = (card.widget_items ?? '').split('\n').filter(Boolean)

            return (
              <div key={card.id} className={`rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100 ${COL_SPANS[index] ?? 'md:col-span-6'}`}>
                <div className={card.widget_type === 'image' ? 'flex items-start justify-between gap-6' : ''}>
                  <div>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
                      <Icon className="h-4 w-4 text-orange-500" />
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">{card.title}</h3>
                    {card.description && <p className="mt-2 max-w-sm text-sm text-gray-500">{card.description}</p>}
                  </div>

                  {card.widget_type === 'image' && card.image_url && (
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg">
                      <Image src={card.image_url} alt="" fill className="object-cover grayscale" />
                    </div>
                  )}
                </div>

                {card.widget_type === 'tags' && tags.length > 0 && (
                  <div className="mt-6 flex gap-4 border-t border-gray-100 pt-4">
                    {tags.map((tag) => (
                      <span key={tag} className="text-xs uppercase tracking-wide text-gray-400">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}