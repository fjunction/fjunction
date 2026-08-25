// components/site/ProgramPricingTable.tsx
type PricingOption = { id: string; duration_label: string; diet_training_price: string | null; diet_only_price: string | null }

export function ProgramPricingTable({ heading, options }: { heading?: string | null; options: PricingOption[] }) {
  return (
    <section className="bg-neutral-950 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {heading && <h2 className="text-2xl font-bold text-white">{heading}</h2>}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {options.map((option) => (
            <div key={option.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <h3 className="text-lg font-semibold text-white">{option.duration_label}</h3>
              <div className="mt-4 space-y-3">
                {option.diet_training_price && (
                  <div className="flex items-baseline justify-between border-t border-neutral-800 pt-3">
                    <span className="text-sm text-neutral-400">Diet + Training</span>
                    <span className="text-base font-semibold text-white">{option.diet_training_price}</span>
                  </div>
                )}
                {option.diet_only_price && (
                  <div className="flex items-baseline justify-between border-t border-neutral-800 pt-3">
                    <span className="text-sm text-neutral-400">Diet Only</span>
                    <span className="text-base font-semibold text-white">{option.diet_only_price}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}