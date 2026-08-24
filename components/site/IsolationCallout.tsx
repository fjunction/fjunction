// components/site/IsolationCallout.tsx
export function IsolationCallout({ heading, bodyText }: { heading: string; bodyText?: string | null }) {
    return (
      <section className="bg-neutral-950 px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-lg border-l-4 border-orange-500 bg-neutral-900 p-6">
          <h3 className="text-lg font-semibold text-white">{heading}</h3>
          {bodyText && <p className="mt-2 text-sm text-neutral-400">{bodyText}</p>}
        </div>
      </section>
    )
  }