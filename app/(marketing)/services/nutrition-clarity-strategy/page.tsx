// app/(marketing)/services/nutrition-clarity-strategy/page.tsx
import { getProgramAssessmentContent } from '@/lib/content'
import { ProgramHero } from '@/components/site/ProgramHero'
import { ProgramTextSection } from '@/components/site/ProgramTextSection'
import { ProgramSteps } from '@/components/site/ProgramSteps'
import { ProgramFeeBox } from '@/components/site/ProgramFeeBox'
import { ClosingCta } from '@/components/site/ClosingCta'

export default async function NutritionClarityStrategyPage() {
  const { page, steps } = await getProgramAssessmentContent()
  return (
    <>
      <ProgramHero
        badgeText={page?.badge_text} heading={page?.heading ?? ''}
        facts={[
          { label: 'Conducted by', value: page?.conducted_by ?? '' },
          { label: 'Fee', value: page?.fee_text ?? '' },
          { label: 'Format', value: page?.format_text ?? '' },
          { label: 'Timeline', value: page?.timeline_text ?? '' },
        ]}
        primaryCtaText={page?.primary_cta_text} primaryCtaHref={page?.primary_cta_href}
        secondaryCtaText={page?.secondary_cta_text} secondaryCtaHref={page?.secondary_cta_href}
      />
      <ProgramTextSection heading={page?.about_heading} body={page?.about_body} />
      <ProgramTextSection heading={page?.audience_heading} body={page?.audience_body} />
      <ProgramSteps heading={page?.structure_heading} steps={steps ?? []} />
      <ProgramTextSection heading={page?.exclusions_heading} body={page?.exclusions_body} />
      <ProgramFeeBox feeText={page?.pricing_fee_text} includesBody={page?.pricing_includes_body} timelineText={page?.pricing_timeline_text} />
      <ProgramTextSection heading={page?.note_heading} body={page?.note_body} />
      <ClosingCta heading={page?.cta_heading ?? ''} subheading={page?.cta_subheading} primaryCtaText={page?.cta_text} primaryCtaHref={page?.cta_href} />
    </>
  )
}