// components/site/LegalHero.tsx
export function LegalHero({ heading, dateLabel }: { heading: string; dateLabel: string }) {
    return (
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold text-gray-900">{heading}</h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{dateLabel}</p>
        </div>
      </section>
    )
  }