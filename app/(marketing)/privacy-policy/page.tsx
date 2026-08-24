// app/(marketing)/privacy-policy/page.tsx
import { getPrivacyPolicyContent } from '@/lib/content'
import { LegalHero } from '@/components/site/LegalHero'
import { LegalSectionList } from '@/components/site/LegalSectionList'

export default async function PrivacyPolicyPage() {
  const { page, sections } = await getPrivacyPolicyContent()
  return (
    <>
      <LegalHero heading={page?.heading ?? 'Privacy Policy'} dateLabel={page?.effective_date_label ?? ''} />
      <LegalSectionList sections={sections ?? []} />
    </>
  )
}