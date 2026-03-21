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
    title: 'The text remains intact',
    body: 'The literary work is presented complete and unabridged. The intervention is interpretive, not editorial.',
  },
  {
    title: 'The introduction argues a case',
    body: 'Each edition includes a new introduction that makes a specific claim about what the work is doing and what problem it enters.',
  },
  {
    title: 'Context is restored, not padded',
    body: 'The point is to recover the philosophical and historical disputes around the book, not to surround it with generic apparatus.',
  },
]

const notPoints = [
  'not a classroom edition built around summaries and notes',
  'not a facsimile or prestige reprint with no interpretive point of view',
  'not a modern retelling or abridgment of the original work',
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
            Classic books do not arrive alone
          </h1>
          <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-[#3f352c]">
            <p>
              They were written into disputes about religion, authority,
              desire, education, freedom, and the shape of modern life. Most
              reprints preserve the text and drop that world of argument around
              it.
            </p>
            <p>
              Heritage Canon publishes editions meant to restore that lost
              context. Each one keeps the original work intact and pairs it
              with a new philosophical introduction by Daniel Shilansky. The
              aim is not to modernize the book or turn it into a lesson. It is
              to recover the pressures, assumptions, and conflicts that made it
              legible to its first readers and to show why those same questions
              still matter.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 border-y border-[#d9c7ae] px-4 py-10 sm:px-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
            The method
          </p>
          <div className="mt-5 space-y-4 text-[1.04rem] leading-relaxed text-[#3f352c]">
            <p>
              A Heritage Canon edition begins from a simple premise: great
              literature often thinks. It does not merely illustrate ideas
              supplied from outside. It participates in arguments of its own.
            </p>
            <p>
              That is why the introductions are not generic background essays.
              They are arguments about what the work sees, what problem it
              confronts, and what kind of reading it requires.
            </p>
          </div>
        </div>
        <aside className="border-t border-[#d9c7ae] pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a2a]">
            In one line
          </p>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-[#3f352c]">
            The book stays intact. The introduction names the argument around
            it.
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
            What it is not
          </p>
          <div className="mt-5 space-y-4">
            {notPoints.map((item) => (
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
            Continue
          </p>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-[#3f352c]">
            Read about the editor behind the introductions, or go directly to
            the catalog.
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
