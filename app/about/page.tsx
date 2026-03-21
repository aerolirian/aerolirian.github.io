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

const corePoints = [
  {
    title: 'Complete original text',
    body: 'Each edition includes the full literary work. The text is not abridged or rewritten.',
  },
  {
    title: 'A new introduction',
    body: 'Each volume includes an original introduction by Daniel Shilansky written specifically for that work.',
  },
  {
    title: 'A stated interpretive claim',
    body: 'The subtitle names the main argument of the introduction so the edition is explicit about its point of view.',
  },
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
    <main className="pb-24">
      <JsonLd data={jsonLd} />

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-14 sm:px-5 lg:px-8 lg:pt-20">
        <div className="max-w-4xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
            About Heritage Canon
          </p>
          <h1 className="mt-5 max-w-[11ch] font-serif text-5xl leading-[0.92] tracking-[-0.04em] text-[#201b16] sm:text-6xl md:text-7xl">
            What Heritage Canon is
          </h1>
          <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-[#3f352c]">
            <p>
              Heritage Canon publishes philosophical editions of classic
              literature. Each edition pairs the complete original work with a
              new introduction by Daniel Shilansky.
            </p>
            <p>
              The introductions reconstruct the intellectual world that shaped
              the book: the philosophical debates, historical pressures, and
              ways of reading that its first audience brought to it, and that
              later editions often leave aside.
            </p>
            <p>
              The aim is not to modernize the work, abridge it, or turn it into
              a classroom edition. The literary text remains intact. The
              introduction is there to make a serious argument about what the
              work is doing and why it still matters.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 border-y border-[#d9c7ae] px-4 py-10 sm:px-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
            What makes the series distinctive
          </p>
          <div className="mt-5 space-y-4 text-[1.04rem] leading-relaxed text-[#3f352c]">
            <p>
              Most reprints provide either no interpretive frame at all or a
              general introduction that stays at the level of background. These
              editions are narrower and more explicit than that.
            </p>
            <p>
              Each introduction advances a definite claim about the work. The
              subtitle on the cover states that claim in advance instead of
              leaving it buried inside prefatory material.
            </p>
          </div>
        </div>
        <aside className="border-t border-[#d9c7ae] pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a2a]">
            Short version
          </p>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-[#3f352c]">
            A Heritage Canon book is a classic work plus a new philosophical
            introduction that argues for a specific reading of it.
          </p>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-5 lg:px-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
          What a Heritage Canon edition is
        </p>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {corePoints.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.75rem] border border-[#d9c7ae] bg-[#fffaf2] p-6 shadow-[0_12px_32px_rgba(61,45,25,0.05)]"
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
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 sm:px-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
            How to read an edition
          </p>
          <div className="mt-5 space-y-4">
            {[
              'Read the introduction first if you want the interpretive frame in advance and do not mind spoilers.',
              'Read the literary work first if you prefer to encounter the text before the editorial argument about it.',
              'Either way, the introduction is meant to sharpen the reading of the work, not to replace it.',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-[#e5d7c2] bg-white/70 px-5 py-4 text-[1.02rem] leading-relaxed text-[#3f352c]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[1.75rem] border border-[#d9c7ae] bg-[#f7f1e7] p-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a2a]">
            Not this
          </p>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-[#3f352c]">
            Heritage Canon is not an abridgment, not a prestige facsimile, and
            not a classroom notes edition. It is a publishing series built
            around original introductions.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/editor/daniel-shilansky"
              className="rounded-full bg-[#8f6a2a] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#7b5b24]"
            >
              Editor page
            </Link>
            <Link
              href="/#catalog"
              className="rounded-full border border-[#ccb28f] bg-[#fffaf2] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#3b322a] transition hover:bg-white"
            >
              Browse catalog
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}
