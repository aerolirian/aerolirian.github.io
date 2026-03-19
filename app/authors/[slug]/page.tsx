import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BookTile } from '@/components/book-tile'
import { JsonLd } from '@/components/json-ld'
import { SITE, getAuthorBySlug, getAuthorRecords } from '@/lib/catalog'

type AuthorPageProps = {
  params: Promise<{ slug: string }>
}

function authorDates(birthYear?: number, deathYear?: number) {
  if (birthYear && deathYear) return `${birthYear}–${deathYear}`
  if (birthYear) return `b. ${birthYear}`
  if (deathYear) return `d. ${deathYear}`
  return null
}

export async function generateStaticParams() {
  return getAuthorRecords().map((author) => ({ slug: author.slug }))
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) return {}

  return {
    title: author.name,
    description: `Available Heritage Canon editions by ${author.name}.`,
    alternates: {
      canonical: `${SITE.url}/authors/${author.slug}`,
    },
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) notFound()

  const dates = authorDates(author.birthYear, author.deathYear)
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
        name: author.name,
        item: `${SITE.url}/authors/${author.slug}`,
      },
    ],
  }
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    birthDate: author.birthYear || undefined,
    deathDate: author.deathYear || undefined,
    description: author.shortBio,
    url: `${SITE.url}/authors/${author.slug}`,
  }
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${author.name} at Heritage Canon`,
    url: `${SITE.url}/authors/${author.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: author.books.length,
      itemListElement: author.books.map((book, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE.url}/books/${book.slug}`,
        name: book.title,
      })),
    },
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-12 sm:px-5 sm:pt-16 lg:px-8">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={personJsonLd} />
      <JsonLd data={collectionJsonLd} />

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
          Author
        </p>
        <h1 className="mt-4 font-serif text-3xl leading-[0.94] tracking-[-0.04em] text-white sm:text-5xl">
          {author.name}
        </h1>
        {dates ? (
          <p className="mt-4 text-sm uppercase tracking-[0.22em] text-zinc-500">{dates}</p>
        ) : null}
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          {author.shortBio}
        </p>
        <dl className="mt-6 grid gap-4 text-sm text-zinc-300 sm:grid-cols-3">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
            <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">Nationality</dt>
            <dd className="mt-2">{author.nationality}</dd>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
            <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">Period</dt>
            <dd className="mt-2">{author.period}</dd>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
            <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">Themes</dt>
            <dd className="mt-2">{author.themes.join(', ')}</dd>
          </div>
        </dl>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          Heritage Canon currently carries {author.books.length}{' '}
          {author.books.length === 1 ? 'edition' : 'editions'} by {author.name}.
        </p>
        <div className="mt-6">
          <Link
            href="/#catalog"
            className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Back to catalog
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d0a85c]">
          Available editions
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-[0.94] tracking-[-0.04em] text-white sm:text-5xl">
          Books by {author.name}
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {author.books.map((book) => (
            <BookTile key={book.slug} book={book} compact />
          ))}
        </div>
      </section>
    </main>
  )
}
