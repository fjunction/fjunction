// app/(marketing)/how-it-works/page.tsx
import { getHowItWorksContent } from '@/lib/content'
import { MethodologyHero } from '@/components/site/MethodologyHero'
import { ProcessSteps } from '@/components/site/ProcessSteps'
import { ClaritySection } from '@/components/site/ClaritySection'

export default async function HowItWorksPage() {
  const { hero, steps, cta } = await getHowItWorksContent()

  return (
    <>
      <MethodologyHero eyebrowText={hero?.eyebrow_text ?? ''} heading={hero?.heading ?? ''} subheading={hero?.subheading} />
      <ProcessSteps steps={steps ?? []} />
      <ClaritySection heading={cta?.heading ?? ''} subheading={cta?.subheading} ctaText={cta?.cta_text} ctaHref={cta?.cta_href} />
    </>
  )
}