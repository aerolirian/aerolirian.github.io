import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/json-ld'
import { SITE } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'About',
  description: SITE.description,
  alternates: {
    canonical: `${SITE.url}/about`,
  },
}

const principles = [
  {
    title: 'The text remains intact',
    body: 'Every edition preserves the full original work. The intervention is interpretive, not editorial.',
  },
  {
    title: 'The subtitle states the claim',
    body: 'Each cover names the argument the introduction will make, so the reader knows the intellectual wager in advance.',
  },
  {
    title: 'The introduction restores context',
    body: 'The goal is to reconstruct the debates, pressures, and assumptions that shaped the work for its first readers.',
  },
]

const process = [
  'A canonical work is selected because it carries a real philosophical problem, not because it is merely famous.',
  'A new introduction is written to state that problem clearly and place the book inside its original field of argument.',
  'The edition is designed so the argument is visible from the cover onward, without displacing the literary work itself.',
]

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Heritage Canon',
    url: `${SITE.url}/about`,
    description: SITE.description,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE.url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: `${SITE.url}/about`,
        },
      ],
    },
  }

  return (
    <main className="pb-20">
      <JsonLd data={jsonLd} />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-14 sm:px-5 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:px-8 lg:pb-18 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
            About Heritage Canon
          </p>
          <h1 className="mt-5 max-w-[11ch] font-serif text-5xl leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
            Editions built around an argument.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Most reprints of classic literature present the text as though it
            were self-explanatory. Heritage Canon does not. Each edition pairs
            the original work with a new philosophical introduction that states
            a specific case about what the work is doing, what kind of world
            produced it, and why that argument remains alive.
          </p>
        </div>

        <div className="about-principles-shell rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.24)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#d0a85c]">
            What defines the series
          </p>
          <div className="mt-5 space-y-5">
            {principles.map((item) => (
              <div
                key={item.title}
                className="about-principle-card rounded-[1.5rem] border border-white/8 bg-[#0b0f15]/75 p-5"
              >
                <h2 className="font-serif text-2xl leading-tight text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 sm:px-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <div className="about-process-card rounded-[2rem] border border-white/10 bg-[#0c1016] p-6 sm:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
            How the editions work
          </p>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
            {process.map((step, index) => (
              <div key={step} className="grid gap-3 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-semibold text-white">
                  0{index + 1}
                </div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="about-side-card rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
            Continue
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">
            The series is edited by Daniel Shilansky. Read the editorial bio or
            go directly to the catalog.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/editor/daniel-shilansky"
              className="rounded-full bg-[#d0a85c] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#111318] transition hover:bg-[#e1bb73]"
            >
              Editor page
            </Link>
            <Link
              href="/#catalog"
              className="rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Browse catalog
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}
