import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BookTile } from '@/components/book-tile'
import { JsonLd } from '@/components/json-ld'
import { LocalizedBuyLinks } from '@/components/localized-buy-links'
import {
  EDITOR,
  SITE,
  getAuthorHref,
  getBook,
  getBooks,
  getRelatedBooks,
} from '@/lib/catalog'

type BookPageProps = {
  params: Promise<{ slug: string }>
}

type FaqItem = {
  question: string
  answer: ReactNode
  schemaAnswer: string
}

function renderParagraph(paragraph: string) {
  const parts = paragraph.split(/(\*[^*]+\*)/g).filter(Boolean)
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={`${part}-${index}`} className="italic">
          {part.slice(1, -1)}
        </em>
      )
    }
    return <span key={`${part}-${index}`}>{part}</span>
  })
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
      images: [book.art_hero_out || book.art_out || book.cover_out],
    },
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params
  const book = getBook(slug)
  if (!book) notFound()
  const related = getRelatedBooks(slug)
  const introClaimAnswer =
    book.intro_claim ||
    'Each introduction advances a specific interpretive claim about the work rather than offering only background or summary.'
  const faqItems: FaqItem[] = [
    {
      question: 'What makes this edition different from a standard reprint?',
      answer:
        'It is not just a reprint of the text. It pairs the complete original work with a new philosophical introduction that reconstructs the conflicts, assumptions, and historical pressures that shaped why the book was written and how it was originally understood.',
      schemaAnswer:
        'It is not just a reprint of the text. It pairs the complete original work with a new philosophical introduction that reconstructs the conflicts, assumptions, and historical pressures that shaped why the book was written and how it was originally understood.',
    },
    {
      question: 'What does the introduction argue about this book?',
      answer: introClaimAnswer,
      schemaAnswer: introClaimAnswer,
    },
    {
      question: 'Who is Daniel Shilansky, and what is his role in this edition?',
      answer: (
        <>
          Daniel Shilansky is the{' '}
          <Link href={`/editor/${EDITOR.slug}`} className="text-[#d0a85c] underline decoration-white/10 underline-offset-4 transition hover:text-white">
            editor
          </Link>{' '}
          of Heritage Canon and the author of this edition’s introduction. His work focuses on how literature and film participate in philosophical argument, and he writes for both general and academic readers.
        </>
      ),
      schemaAnswer:
        'Daniel Shilansky is the editor of Heritage Canon and the author of this edition’s introduction. His work focuses on how literature and film participate in philosophical argument, and he writes for both general and academic readers.',
    },
    {
      question: 'Do I need to read the introduction before the novel?',
      answer:
        'No. You can read it first (if you do not mind plot spoilers) or return to it after the novel; the edition is designed to work either way.',
      schemaAnswer:
        'No. You can read it first if you do not mind plot spoilers, or return to it after the novel; the edition is designed to work either way.',
    },
    {
      question: 'Is the introduction academic or written for general readers?',
      answer:
        'It is intellectually serious but written for general readers, not only for specialists.',
      schemaAnswer:
        'It is intellectually serious but written for general readers, not only for specialists.',
    },
    {
      question: 'Is this text complete and unabridged?',
      answer: 'Yes. The literary text is presented complete and unabridged.',
      schemaAnswer: 'Yes. The literary text is presented complete and unabridged.',
    },
    {
      question: 'Why does this edition use the label “Philosophical Edition”?',
      answer:
        'Because the introduction treats the book not just as a plot to summarize or a historical artifact to place, but as an intervention in larger questions of selfhood, morality, religion, desire, freedom, politics, and the shape of modern life.',
      schemaAnswer:
        'Because the introduction treats the book not just as a plot to summarize or a historical artifact to place, but as an intervention in larger questions of selfhood, morality, religion, desire, freedom, politics, and the shape of modern life.',
    },
  ]
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
  const bookOffers = book.buy_links.flatMap((link) => {
    const domains = link.verified_domains?.length
      ? link.verified_domains
      : [new URL(link.url).host]

    return domains.map((domain) => {
      const isAmazonCom = domain === 'www.amazon.com'
      return {
        '@type': 'Offer',
        category: link.label,
        price: isAmazonCom ? link.price ?? undefined : undefined,
        priceCurrency: isAmazonCom ? link.price_currency || undefined : undefined,
        seller: link.seller
          ? {
              '@type': 'Organization',
              name: link.seller,
            }
          : undefined,
        availability: link.availability || undefined,
        itemCondition: link.item_condition || undefined,
        url: `https://${domain}/dp/${link.asin}`,
      }
    })
  })
  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    alternateName: book.full_title || undefined,
    image: [`${SITE.url}${book.cover_out}`, `${SITE.url}${book.art_hero_out || book.art_out || book.cover_out}`],
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
    subjectOf:
      book.essays && book.essays.length > 0
        ? book.essays.map((essay) => ({
            '@type': 'ScholarlyArticle',
            name: `${book.title} essay`,
            url: essay.url,
            author: {
              '@type': 'Person',
              name: book.intro_author,
            },
          }))
        : undefined,
    offers: bookOffers,
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.schemaAnswer,
      },
    })),
  }

  return (
    <main className="pb-20">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={bookJsonLd} />
      <JsonLd data={faqJsonLd} />
      <section className="product-hero-section relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src={book.art_hero_out || book.art_out || book.cover_out}
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
              <Link href={getAuthorHref(book.author)} className="transition hover:text-zinc-300">
                {book.author}
              </Link>
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
              {book.essays && book.essays.length > 0 ? (
                <div className="sm:col-span-2">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                    Related essays
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                    {book.essays.map((essay) => (
                      <a
                        key={`${essay.label}:${essay.url}`}
                        href={essay.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#d0a85c] underline decoration-white/10 underline-offset-4 transition hover:text-white"
                      >
                        {essay.label}
                      </a>
                    ))}
                  </div>
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
                <p key={paragraph}>{renderParagraph(paragraph)}</p>
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
          FAQ
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-[0.94] tracking-[-0.04em] text-white sm:text-5xl">
          About this edition
        </h2>
        <div className="mt-8 space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6"
            >
              <h3 className="font-serif text-xl leading-tight text-white sm:text-2xl">
                {item.question}
              </h3>
              <div className="mt-3 text-base leading-relaxed text-zinc-300">{item.answer}</div>
            </div>
          ))}
        </div>
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
