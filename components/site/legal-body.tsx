// components/site/legal-body.tsx
export function renderInline(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
    )
  }
  
  export function LegalBody({ text }: { text: string }) {
    const blocks: Array<{ type: 'p' | 'ul'; lines: string[] }> = []
    let current: { type: 'p' | 'ul'; lines: string[] } | null = null
  
    for (const raw of text.split('\n')) {
      const trimmed = raw.trim()
      if (trimmed === '') {
        current = null
        continue
      }
      const isBullet = trimmed.startsWith('- ')
      const type = isBullet ? 'ul' : 'p'
      const content = isBullet ? trimmed.slice(2) : trimmed
      if (current && current.type === type) current.lines.push(content)
      else {
        current = { type, lines: [content] }
        blocks.push(current)
      }
    }
  
    return (
      <div className="space-y-4 text-sm leading-relaxed text-gray-600">
        {blocks.map((block, i) =>
          block.type === 'ul' ? (
            <ul key={i} className="list-disc space-y-2 pl-5">
              {block.lines.map((line, j) => <li key={j}>{renderInline(line)}</li>)}
            </ul>
          ) : (
            <p key={i}>{renderInline(block.lines.join(' '))}</p>
          )
        )}
      </div>
    )
  }