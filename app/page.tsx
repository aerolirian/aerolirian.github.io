import Image from 'next/image'
import Link from 'next/link'

import { CatalogBrowser } from '@/components/catalog-browser'
import { JsonLd } from '@/components/json-ld'
import { getAuthors, getBooks, getFeaturedBooks, getFormats } from '@/lib/catalog'
import { SITE } from '@/lib/catalog'

export default function HomePage() {
  const books = getBooks()
  const featured = getFeaturedBooks()
  const authors = getAuthors(books)
  const formats = getFormats(books)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Heritage Canon catalog',
    url: SITE.url,
    description: SITE.description,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: books.length,
      itemListElement: books.slice(0, 12).map((book, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE.url}/books/${book.slug}`,
        name: book.title,
      })),
    },
  }

  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 pt-16 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:px-8 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
            Available now
          </p>
          <h1 className="mt-5 max-w-[11ch] font-serif text-6xl leading-[0.88] tracking-[-0.04em] text-white md:text-7xl">
            Classic literature staged like a live argument.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Heritage Canon publishes philosophical editions of classic works.
            Each book pairs the original text with a new introduction that
            reconstructs the intellectual world around it and states the claim
            the edition is making.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalog"
              className="rounded-full bg-[#d0a85c] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#111318] transition hover:bg-[#e1bb73]"
            >
              Browse catalog
            </a>
            <Link
              href="/editor/daniel-shilansky"
              className="rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Meet the editor
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                Available editions
              </p>
              <p className="mt-3 font-serif text-4xl text-white">{books.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                Authors
              </p>
              <p className="mt-3 font-serif text-4xl text-white">{authors.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                Formats
              </p>
              <p className="mt-3 font-serif text-4xl text-white">{formats.length}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-2">
          {featured.slice(0, 4).map((book, index) => (
            <Link
              key={book.slug}
              href={`/books/${book.slug}`}
              className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.35)] ${
                index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="relative min-h-[16rem] overflow-hidden rounded-[1.35rem]">
                <Image
                  src={book.art_out || book.cover_out}
                  alt={book.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/50 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <div className="max-w-[18rem]">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#d0a85c]">
                      {book.author}
                    </p>
                    <h2 className="mt-2 font-serif text-3xl leading-[0.9] text-white">
                      {book.title}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-300">
                      {book.thesis_subtitle}
                    </p>
                  </div>
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-2xl">
                    <Image
                      src={book.cover_out}
                      alt={`Cover of ${book.title}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-12 lg:grid-cols-3 lg:px-8">
        {[
          'The original title stays primary.',
          'The thesis subtitle states the editorial claim.',
          'The introduction restores the book’s intellectual pressure.',
        ].map((line) => (
          <div
            key={line}
            className="rounded-[1.75rem] border border-white/10 bg-[#0c1016] px-5 py-6 text-lg text-zinc-200"
          >
            {line}
          </div>
        ))}
      </section>

      <section id="catalog" className="mx-auto w-full max-w-7xl px-5 pb-20 pt-8 lg:px-8">
        <CatalogBrowser books={books} authors={authors} formats={formats} />
      </section>
    </main>
  )
}
