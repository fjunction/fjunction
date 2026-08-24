// components/site/Panel.tsx
import Image from 'next/image'
import { Award } from 'lucide-react'

type PanelStat = { id: string; value: string; label: string }

export function Panel({
  eyebrowText,
  heading,
  bodyText,
  photoUrl,
  statusBadgeText,
  personName,
  personExperienceText,
  stats,
}: {
  eyebrowText: string
  heading: string
  bodyText?: string | null
  photoUrl?: string | null
  statusBadgeText?: string | null
  personName?: string | null
  personExperienceText?: string | null
  stats: PanelStat[]
}) {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
            <Award className="h-4 w-4" />
            {eyebrowText}
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {heading}
          </h2>

          {bodyText && <p className="mt-5 max-w-md text-sm text-gray-500">{bodyText}</p>}

          {(personName || personExperienceText) && (
            <p className="mt-4 text-sm text-gray-600">
              {personName}
              {personName && personExperienceText && ' · '}
              {personExperienceText}
            </p>
          )}

          {stats.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-gray-200 pt-6">
              {stats.map((stat) => (
                <div key={stat.id}>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          {photoUrl ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <Image src={photoUrl} alt={personName ?? ''} fill className="object-cover" />
              {statusBadgeText && (
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  {statusBadgeText}
                </span>
              )}
            </div>
          ) : (
            <div className="aspect-[4/5] w-full rounded-2xl bg-gray-200" />
          )}
        </div>
      </div>
    </section>
  )
}