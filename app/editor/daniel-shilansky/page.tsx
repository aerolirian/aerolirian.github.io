import type { Metadata } from 'next'
import Image from 'next/image'

import { BookTile } from '@/components/book-tile'
import { JsonLd } from '@/components/json-ld'
import { EDITOR, SITE, getFeaturedBooks } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Daniel Shilansky',
  description: 'Editor of Heritage Canon.',
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
      <section className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
          <Image
            src={EDITOR.image}
            alt={EDITOR.name}
            width={1024}
            height={1024}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 20rem"
          />
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
            Editor
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl">
            {EDITOR.name}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.22em] text-zinc-500">
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
          Selected editions
        </p>
        <h2 className="mt-4 max-w-[10ch] font-serif text-4xl leading-[0.94] tracking-[-0.04em] text-white sm:text-5xl">
          Current Heritage Canon books with his introductions.
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
