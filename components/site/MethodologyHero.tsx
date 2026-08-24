// components/site/MethodologyHero.tsx
export function MethodologyHero({
    eyebrowText,
    heading,
    subheading,
  }: {
    eyebrowText: string
    heading: string
    subheading?: string | null
  }) {
    return (
      <section className="relative overflow-hidden bg-gray-50 py-20">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">{eyebrowText}</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">{heading}</h1>
          {subheading && <p className="mt-5 max-w-xl text-base text-gray-500">{subheading}</p>}
        </div>
      </section>
    )
  }