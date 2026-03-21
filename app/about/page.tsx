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

const editionPoints = [
  {
    title: 'The literary text stays intact',
    body: 'The original work is presented complete and unabridged. The intervention is interpretive, not editorial.',
  },
  {
    title: 'The introduction makes a claim',
    body: 'Each edition includes a new introduction by Daniel Shilansky that argues for a specific way of reading the work.',
  },
  {
    title: 'The subtitle names that claim',
    body: 'The thesis subtitle on the cover states the central argument in plain terms instead of hiding it in jacket copy.',
  },
]

const readingOptions = [
  'Read the introduction first if you want the philosophical frame in advance and do not mind spoilers.',
  'Read the literary work first if you want the book to arrive before the argument about it does.',
  'Either way, the point is the same: the introduction is there to sharpen the reading, not to replace it.',
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

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-12 pt-12 sm:px-5 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:px-8 lg:pt-18">
        <div className="max-w-4xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
            About Heritage Canon
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-5xl leading-[0.92] tracking-[-0.04em] text-[#201b16] sm:text-6xl md:text-7xl">
            Why these editions exist
          </h1>
          <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-[#3f352c]">
            <p>
              Classic books were written into arguments about religion,
              authority, desire, education, freedom, and the shape of modern
              life. Most modern reprints preserve the text but drop that world
              of argument around it.
            </p>
            <p>
              Heritage Canon exists to restore that lost context. Each edition
              keeps the original work intact and pairs it with a new
              philosophical introduction by Daniel Shilansky. The aim is not to
              modernize the book or reduce it to a lesson. It is to recover the
              pressures, assumptions, and disputes that made the book mean what
              it meant when it first appeared, and to show why those questions
              are still alive.
            </p>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-[#d8c8ae] bg-white/70 p-6 shadow-[0_18px_55px_rgba(61,45,25,0.08)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a2a]">
            In practice
          </p>
          <div className="mt-5 space-y-5 text-[1.02rem] leading-relaxed text-[#3f352c]">
            <p>
              These are not facsimiles, classroom editions, or generic
              reprints. They are interpretive editions for readers who want the
              philosophical stakes of the work made explicit.
            </p>
            <p>
              The literary work remains primary. The introduction is there to
              clarify the conflict the book enters, not to stand in front of
              it.
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/editor/daniel-shilansky"
              className="rounded-full bg-[#8f6a2a] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#7b5b24]"
            >
              Editor page
            </Link>
            <Link
              href="/#catalog"
              className="rounded-full border border-[#ccb28f] bg-[#f7f1e7] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#3b322a] transition hover:bg-white"
            >
              Browse catalog
            </Link>
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-5 lg:px-8">
        <div className="rounded-[2rem] border border-[#d8c8ae] bg-white/70 p-6 shadow-[0_18px_55px_rgba(61,45,25,0.08)] sm:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
            What a Heritage Canon edition includes
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {editionPoints.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[#e5d7c2] bg-[#fcf8f2] p-5"
              >
                <h2 className="font-serif text-2xl leading-tight text-[#201b16]">
                  {item.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4a4036]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 sm:px-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
        <div className="rounded-[2rem] border border-[#d8c8ae] bg-white/70 p-6 shadow-[0_18px_55px_rgba(61,45,25,0.08)] sm:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
            How to use an edition
          </p>
          <div className="mt-6 space-y-5 text-[1.04rem] leading-relaxed text-[#3f352c]">
            {readingOptions.map((step, index) => (
              <div key={step} className="grid gap-3 sm:grid-cols-[2.75rem_minmax(0,1fr)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c8ae] bg-[#f7f1e7] text-sm font-semibold text-[#201b16]">
                  0{index + 1}
                </div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-[#d8c8ae] bg-[#f7f1e7] p-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a2a]">
            Short version
          </p>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-[#3f352c]">
            Heritage Canon publishes classic literature with new philosophical
            introductions. The book stays intact. The introduction names the
            argument around it.
          </p>
        </aside>
      </section>
    </main>
  )
}
