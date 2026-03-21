import Image from 'next/image'
import Link from 'next/link'

import { CatalogBrowser } from '@/components/catalog-browser'
import { JsonLd } from '@/components/json-ld'
import { getAuthors, getBooks, getFeaturedBooks, getFormats } from '@/lib/catalog'
import { SITE } from '@/lib/catalog'

export default function HomePage() {
  const books = getBooks()
  const featured = getFeaturedBooks(3)
  const authors = getAuthors(books)
  const formats = getFormats(books)
  const heroQuotes: Record<string, string> = {
    a_portrait_of_the_artist_as_a_young_man:
      'Joyce shows apostasy not as a gesture of rebellion, but as a painful struggle to claim a self from the forces that formed it.',
    the_great_gatsby:
      'The novel concerns the nature of the self: what a person is, whether a person can be remade, and what it costs, morally and spiritually, to attempt such a remaking.',
    moby_dick:
      'What happens to a democratic community when it is placed under the command of a will that recognizes no limit but its own?',
  }
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
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-14 pt-10 sm:px-5 sm:pt-14 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:px-8 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
            Current series
          </p>
          <h1 className="mt-4 max-w-[11ch] font-serif text-4xl leading-[0.9] tracking-[-0.04em] text-white sm:mt-5 sm:text-6xl md:text-7xl">
            Philosophical Editions
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:mt-6 sm:text-lg">
            Heritage Canon is an independent press. The books currently
            featured here belong to Philosophical Editions, a series that pairs
            classic works with new introductions by Daniel Shilansky and
            presents each one through a specific interpretive claim.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <a
              href="#catalog"
              className="rounded-full bg-[#d0a85c] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#111318] transition hover:bg-[#e1bb73]"
            >
              Browse catalog
            </a>
            <Link
              href="/editor/daniel-shilansky"
              className="rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              About the series
            </Link>
          </div>
        </div>

        <div className="space-y-4 lg:hidden">
          <div className="grid gap-4">
            {featured.map((book) => (
              <div key={book.slug} className="space-y-3">
                <Link
                  href={`/books/${book.slug}`}
                  className="hero-feature-card group relative block overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.35)]"
                >
                  <div className="hero-feature-media relative min-h-[19rem] overflow-hidden rounded-[1.35rem]">
                    <Image
                      src={book.art_hero_out || book.art_out || book.cover_out}
                      alt={book.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="100vw"
                      priority={book.slug === featured[0]?.slug}
                    />
                    <div className="hero-feature-overlay absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#090b10] via-[#090b10]/72 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5">
                      <p className="hero-card-author text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#d0a85c] drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)]">
                        {book.author}
                      </p>
                      <h2 className="mt-2 max-w-[12ch] font-serif text-2xl leading-[0.92] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                        {book.title}
                      </h2>
                      <p className="mt-2 max-w-[28ch] text-sm text-zinc-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]">
                        {book.thesis_subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="hero-quote-card rounded-[1.75rem] border border-white/10 bg-[#0c1016] px-5 py-5 text-base leading-relaxed text-zinc-200">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#d0a85c]">
                    {book.title}
                  </p>
                  <p className="mt-3 text-zinc-300">“{heroQuotes[book.slug]}”</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden gap-4 lg:grid lg:grid-cols-2">
          {featured.map((book, index) => (
            <Link
              key={book.slug}
              href={`/books/${book.slug}`}
              className={`hero-feature-card group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.35)] ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="hero-feature-media relative min-h-[18rem] overflow-hidden rounded-[1.35rem] sm:min-h-[16rem]">
                <Image
                  src={book.art_hero_out || book.art_out || book.cover_out}
                  alt={book.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                />
                <div className="hero-feature-overlay absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#090b10] via-[#090b10]/72 to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <div className="max-w-[18rem]">
                    <p className="hero-card-author text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#d0a85c] drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)]">
                      {book.author}
                    </p>
                    <h2 className="mt-2 max-w-[12ch] font-serif text-2xl leading-[0.92] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] sm:text-3xl">
                      {book.title}
                    </h2>
                    <p className="mt-2 max-w-[28ch] text-sm text-zinc-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]">
                      {book.thesis_subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto hidden w-full max-w-7xl gap-4 px-4 pb-12 sm:px-5 lg:grid lg:grid-cols-3 lg:px-8">
        {featured.map((book) => (
          <div
            key={book.slug}
            className="hero-quote-card rounded-[1.75rem] border border-white/10 bg-[#0c1016] px-5 py-5 text-base leading-relaxed text-zinc-200 sm:py-6 sm:text-lg"
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#d0a85c]">
              {book.title}
            </p>
            <p className="mt-3 text-zinc-300">“{heroQuotes[book.slug]}”</p>
          </div>
        ))}
      </section>

      <section id="catalog" className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-5 lg:px-8">
        <CatalogBrowser books={books} authors={authors} formats={formats} />
      </section>
    </main>
  )
}
