// app/(admin)/admin/(protected)/content/page.tsx
import Link from 'next/link'

const HOMEPAGE_SECTIONS = [
  { href: '/admin/content/header', label: 'Header', description: 'Logo, nav links, and top CTA button' },
  { href: '/admin/content/hero', label: 'Hero Section', description: 'Eyebrow badge, heading, subheading, and CTAs' },
  { href: '/admin/content/signals', label: 'Recognize the Signals', description: 'Section heading and the 3 symptom cards' },
  { href: '/admin/content/framework', label: 'Clinical Approach', description: 'Section heading and the 2 framework steps' },
  { href: '/admin/content/panel', label: 'Panel', description: 'Practitioner intro, photo, and stats' },
  { href: '/admin/content/footer', label: 'Footer', description: 'Logo, disclaimer, links, and social links' },
]

const HOW_IT_WORKS_SECTIONS = [
  { href: '/admin/content/how-it-works-hero', label: 'Methodology Hero Section', description: 'Eyebrow, heading, and subheading' },
  { href: '/admin/content/how-it-works-steps', label: 'Process Steps', description: 'The 4 step cards and their preview widgets' },
  { href: '/admin/content/how-it-works-cta', label: 'Clarity CTA', description: 'Closing heading, subheading, and button' },
]

const SERVICES_SECTIONS = [
  { href: '/admin/content/services-hero', label: 'Services Hero Section', description: 'Eyebrow, heading, and subheading' },
  { href: '/admin/content/services-protocol', label: 'Services Protocol', description: 'The 4 step cards and their preview widgets' },
  { href: '/admin/content/services-cta', label: 'Services CTA', description: 'Closing heading, subheading, and button' },
]

function SectionGrid({ sections }: { sections: typeof HOMEPAGE_SECTIONS }) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {sections.map((section) => (
        <Link key={section.href} href={section.href} className="rounded-lg border border-gray-200 p-5 hover:border-gray-300 hover:bg-gray-50">
          <h3 className="font-semibold text-gray-900">{section.label}</h3>
          <p className="mt-1 text-sm text-gray-500">{section.description}</p>
        </Link>
      ))}
    </div>
  )
}

export default function ContentManagementPage() {
  return (
    <div className="mx-auto max-w-4xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
      <p className="mt-1 text-sm text-gray-500">Edit the public website content. Changes go live immediately.</p>

      <h2 className="mt-8 text-lg font-semibold text-gray-900">Homepage</h2>
      <SectionGrid sections={HOMEPAGE_SECTIONS} />

      <h2 className="mt-10 text-lg font-semibold text-gray-900">How It Works</h2>
      <SectionGrid sections={HOW_IT_WORKS_SECTIONS} />

      <h2 className="mt-10 text-lg font-semibold text-gray-900">Services</h2>
      <SectionGrid sections={SERVICES_SECTIONS} />
    </div>
  )
}