// app/(marketing)/masterclass/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getMasterclassBySlug, isRegistrationOpen } from '@/lib/masterclass'
import { RegisterProvider } from '@/components/masterclass/RegisterProvider'
import {
  MasterclassTopBar,
  HeroSection,
  ProblemSection,
  ExpertSection,
  TopicsSection,
  OfferSection,
  FitSection,
  FaqSection,
  ClosingSection,
} from '@/components/masterclass/MasterclassSections'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mc = await getMasterclassBySlug(slug)
  return mc ? { title: mc.title, description: mc.subheading ?? undefined } : {}
}

export default async function MasterclassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mc = await getMasterclassBySlug(slug)
  if (!mc) notFound()

  const open = isRegistrationOpen(mc)
  const target = mc.pricing_ends_at ?? mc.event_at
  const countdownTarget = open && target && new Date(target).getTime() > Date.now() ? target : null
  const countdownLabel = mc.pricing_ends_at ? 'Special pricing ends in' : 'Masterclass starts in'

  return (
    <RegisterProvider masterclassId={mc.id} title={mc.title} registrationOpen={open} hasUsdPrice={mc.price_usd != null}>
      <div className="bg-slate-950 text-white">
        {!mc.is_published && (
          <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold text-slate-950">
            Draft — only logged-in admins can see this page
          </div>
        )}
        <MasterclassTopBar text={mc.top_bar_text} countdownTarget={countdownTarget} />
        <HeroSection mc={mc} />
        <ProblemSection mc={mc} />
        <ExpertSection mc={mc} />
        <TopicsSection mc={mc} />
        <OfferSection mc={mc} />
        <FitSection mc={mc} />
        <FaqSection mc={mc} />
        <ClosingSection mc={mc} countdownTarget={countdownTarget} countdownLabel={countdownLabel} />
      </div>
    </RegisterProvider>
  )
}