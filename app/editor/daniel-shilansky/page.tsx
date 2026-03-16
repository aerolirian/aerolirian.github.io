import type { Metadata } from 'next'
import Image from 'next/image'

import { BookTile } from '@/components/book-tile'
import { JsonLd } from '@/components/json-ld'
import { EDITOR, SITE, getFeaturedBooks } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Daniel Shilansky',
  description: 'Series editor of Heritage Canon. Author of the philosophical introductions.',
  alternates: {
    canonical: `${SITE.url}/editor/${EDITOR.slug}`,
  },
}

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
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-12 sm:px-5 sm:pt-16 lg:px-8">
      <JsonLd data={jsonLd} />
      <section className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] lg:mx-0 lg:max-w-none">
          <Image
            src={EDITOR.image}
            alt={EDITOR.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 15rem"
          />
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
            Series editor
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-[0.94] tracking-[-0.04em] text-white sm:text-5xl">
            {EDITOR.name}
          </h1>
          <p className="mt-4 text-sm text-zinc-500">
            {EDITOR.role}
          </p>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
            {EDITOR.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
          In the catalog
        </p>
        <h2 className="mt-4 max-w-[12ch] font-serif text-4xl leading-[0.94] tracking-[-0.04em] text-white sm:text-5xl">
          Editions introduced by Daniel Shilansky.
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookTile key={book.slug} book={book} compact />
          ))}
        </div>
      </section>
    </main>
  )
}
