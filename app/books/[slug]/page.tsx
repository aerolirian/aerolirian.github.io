import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BookTile } from '@/components/book-tile'
import { JsonLd } from '@/components/json-ld'
import { LocalizedBuyLinks } from '@/components/localized-buy-links'
import { EDITOR, SITE, getBook, getBooks, getRelatedBooks } from '@/lib/catalog'

type BookPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getBooks().map((book) => ({ slug: book.slug }))
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params
  const book = getBook(slug)
  if (!book) return {}
  return {
    title: book.title,
    description: book.description,
    alternates: {
      canonical: `${SITE.url}/books/${book.slug}`,
    },
    openGraph: {
      title: book.full_title || book.title,
      description: book.description,
      url: `${SITE.url}/books/${book.slug}`,
      images: [book.art_out || book.cover_out],
    },
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params
  const book = getBook(slug)
  if (!book) notFound()
  const related = getRelatedBooks(slug)
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Catalog',
        item: SITE.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: book.title,
        item: `${SITE.url}/books/${book.slug}`,
      },
    ],
  }
  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    alternateName: book.full_title || undefined,
    image: [`${SITE.url}${book.cover_out}`, `${SITE.url}${book.art_out || book.cover_out}`],
    description: book.description,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    editor: {
      '@type': 'Person',
      name: book.intro_author,
    },
    publisher: {
      '@type': 'Organization',
      name: book.publisher,
      url: SITE.url,
    },
    datePublished: book.year || undefined,
    bookEdition: 'Philosophical Edition',
    url: `${SITE.url}/books/${book.slug}`,
    subjectOf: book.essay_url
      ? {
          '@type': 'ScholarlyArticle',
          url: book.essay_url,
          author: {
            '@type': 'Person',
            name: book.intro_author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Substack',
          },
        }
      : undefined,
    offers: book.buy_links.map((link) => ({
      '@type': 'Offer',
      category: link.label,
      priceCurrency: 'USD',
      url: link.url,
    })),
  }

  return (
    <main className="pb-20">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={bookJsonLd} />
      <section className="product-hero-section relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src={book.art_out || book.cover_out}
            alt={book.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="product-hero-overlay absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,13,0.2),rgba(7,9,13,0.84)_30%,#07090d)]" />
        </div>
        <div className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-5 sm:py-16 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start lg:px-8 lg:py-20">
          <div className="product-cover-frame mx-auto w-full max-w-xs self-start overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.4)]">
            <Image
              src={book.cover_out}
              alt={`Cover of ${book.title}`}
              width={720}
              height={1152}
              className="product-cover-image block h-auto w-full object-cover"
              sizes="(max-width: 1024px) 70vw, 20rem"
              priority
            />
          </div>
          <div className="product-hero-panel rounded-[2rem] border border-white/10 bg-[#0a0d13]/70 p-5 backdrop-blur-xl sm:p-6 lg:p-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
              Philosophical edition
            </p>
            <h1 className="mt-4 max-w-[12ch] font-serif text-4xl leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl">
              {book.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-tight text-zinc-200 sm:text-2xl">
              {book.thesis_subtitle}
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.22em] text-zinc-500">
              {book.author}
            </p>
            <LocalizedBuyLinks links={book.buy_links} />
            <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm text-zinc-300 sm:grid-cols-2">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                  Introduction by
                </p>
                <p className="mt-2">{book.intro_author}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                  Available formats
                </p>
                <p className="mt-2">{book.buy_links.map((item) => item.label).join(', ')}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                  Original publication
                </p>
                <p className="mt-2">{book.year || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                  Genre
                </p>
                <p className="mt-2">{book.genre || 'Classic literature'}</p>
              </div>
              {book.essay_url ? (
                <div className="sm:col-span-2">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                    Related essay
                  </p>
                  <p className="mt-2">
                    <a
                      href={book.essay_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#d0a85c] underline decoration-white/10 underline-offset-4 transition hover:text-white"
                    >
                      Read the related essay on Substack
                    </a>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-5 sm:py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
            The argument
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[0.94] tracking-[-0.04em] text-white sm:text-5xl">
            What this edition argues
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
            {book.description
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>
        </div>
        <aside className="product-editor-card h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
            Editor
          </p>
          <h3 className="mt-4 font-serif text-3xl leading-[0.94] text-white">
            {EDITOR.name}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Each Heritage Canon introduction argues a philosophical case about
            the work: what it was doing, what debates it entered, and what its
            first readers brought to it.
          </p>
          <Link
            href={`/editor/${EDITOR.slug}`}
            className="mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Read bio
          </Link>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-5 lg:px-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
          Continue browsing
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-[0.94] tracking-[-0.04em] text-white sm:text-5xl">
          More in the catalog
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <BookTile key={item.slug} book={item} compact />
          ))}
        </div>
      </section>
    </main>
  )
}
