import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BookTile } from '@/components/book-tile'
import { JsonLd } from '@/components/json-ld'
import { EDITOR, SITE, getFeaturedBooks } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Daniel Shilansky',
  description:
    'Series editor of Heritage Canon and author of the philosophical introductions.',
  alternates: {
    canonical: `${SITE.url}/editor/${EDITOR.slug}`,
  },
}

const focusAreas = [
  'philosophy in narrative art',
  'literature as argument, not illustration',
  'critical introductions for general and academic readers',
]

export default function EditorPage() {
  const books = getFeaturedBooks(6)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: EDITOR.name,
    image: `${SITE.url}${EDITOR.image}`,
    jobTitle: EDITOR.role,
    alumniOf: 'Tel Aviv University',
    worksFor: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    url: `${SITE.url}/editor/${EDITOR.slug}`,
  }

  return (
    <main className="pb-24">
      <JsonLd data={jsonLd} />

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-14 sm:px-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:px-8 lg:pt-20">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-[#d9c7ae] bg-[#fffaf2] shadow-[0_18px_48px_rgba(61,45,25,0.08)] lg:mx-0 lg:max-w-none">
          <Image
            src={EDITOR.image}
            alt={EDITOR.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 15rem"
          />
        </div>

        <div className="max-w-4xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
            Series editor
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.92] tracking-[-0.04em] text-[#201b16] sm:text-6xl">
            {EDITOR.name}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#7a6958]">
            {EDITOR.role}
          </p>

          <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#3f352c]">
            {EDITOR.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 border-y border-[#d9c7ae] px-4 py-10 sm:px-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
            Editorial focus
          </p>
          <div className="mt-5 space-y-4 text-[1.04rem] leading-relaxed text-[#3f352c]">
            <p>
              Daniel Shilansky&apos;s work begins from the view that literature
              and film do not simply decorate ideas worked out elsewhere. They
              often think for themselves, and they do so in forms that ordinary
              criticism tends to flatten or miss.
            </p>
            <p>
              The Heritage Canon introductions are written from that premise.
              They are meant to be intellectually serious without becoming
              professionalized prose written only for specialists.
            </p>
          </div>
        </div>
        <aside className="border-t border-[#d9c7ae] pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a2a]">
            Focus areas
          </p>
          <ul className="mt-4 space-y-3 text-[1.02rem] leading-relaxed text-[#3f352c]">
            {focusAreas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-[#6a5a4b]">
            Studied at Tel Aviv University.
          </p>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8f6a2a]">
              In the catalog
            </p>
            <h2 className="mt-4 max-w-[13ch] font-serif text-4xl leading-[0.94] tracking-[-0.04em] text-[#201b16] sm:text-5xl">
              Editions introduced by Daniel Shilansky
            </h2>
          </div>
          <Link
            href="/#catalog"
            className="rounded-full border border-[#ccb28f] bg-[#fffaf2] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#3b322a] transition hover:bg-white"
          >
            Browse catalog
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookTile key={book.slug} book={book} compact />
          ))}
        </div>
      </section>
    </main>
  )
}
