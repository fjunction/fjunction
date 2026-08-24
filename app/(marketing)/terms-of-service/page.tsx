// app/(marketing)/terms-of-service/page.tsx
import { getTermsContent } from '@/lib/content'
import { LegalHero } from '@/components/site/LegalHero'
import { LegalSectionCards } from '@/components/site/LegalSectionCards'

export default async function TermsOfServicePage() {
  const { page, sections } = await getTermsContent()
  return (
    <>
      <LegalHero heading={page?.heading ?? 'Terms of Service'} dateLabel={page?.updated_label ?? ''} />
      <LegalSectionCards sections={sections ?? []} />
    </>
  )
}