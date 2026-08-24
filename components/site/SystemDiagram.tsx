// components/site/SystemDiagram.tsx
type Tag = { id: string; label: string; description: string | null }
type Node = { id: string; label: string }

export function SystemDiagram({
  heading, headingSecondary, subheading, tags, nodes,
}: { heading: string; headingSecondary?: string | null; subheading?: string | null; tags: Tag[]; nodes: Node[] }) {
  // Fixed positions by index: 0=top, 1=right, 2=bottom, 3=left
  const positions = [
    'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
    'left-full top-1/2 -translate-y-1/2 -translate-x-1/2',
    'left-1/2 top-full -translate-x-1/2 -translate-y-1/2',
    'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2',
  ]

  return (
    <section className="bg-neutral-950 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {heading}
            {headingSecondary && <span className="block text-neutral-500">{headingSecondary}</span>}
          </h2>
          {subheading && <p className="mt-4 max-w-md text-sm text-neutral-400">{subheading}</p>}
          <div className="mt-8 space-y-4">
            {tags.map((tag) => (
              <div key={tag.id} className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                <span className="text-sm font-semibold text-orange-500">{tag.label}</span>
                {tag.description && <p className="mt-1 text-xs text-neutral-400">{tag.description}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-8 rounded-full border border-orange-500/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-orange-500/40 bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange-500">
              The System
            </span>
          </div>
          {nodes.map((node, index) => (
            <span key={node.id} className={`absolute rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 ${positions[index] ?? ''}`}>
              {node.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}