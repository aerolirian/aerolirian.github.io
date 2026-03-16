import catalog from '@/content/catalog.json'

export type BuyLink = {
  label: string
  format: 'ebook' | 'paperback' | 'hardcover' | 'audiobook' | string
  asin: string
  url: string
}

export type Book = {
  slug: string
  title: string
  full_title: string
  thesis_subtitle: string
  author: string
  intro_author: string
  genre: string
  year: string
  publisher: string
  cover_out: string
  art_out: string
  description: string
  excerpt: string
  formats: string[]
  buy_links: BuyLink[]
}

type CatalogPayload = {
  books: Book[]
}

const payload = catalog as CatalogPayload

export const EDITOR = {
  name: 'Daniel Shilansky',
  slug: 'daniel-shilansky',
  role: 'Editor, Heritage Canon',
  image: '/assets/bio.webp',
  bio: [
    'Daniel Shilansky is the editor of Heritage Canon, an independent press publishing philosophical editions of classic literature. Each edition includes an original critical introduction that reconstructs the intellectual world that shaped the work: the philosophical debates, historical pressures, and ways of reading that its first audience brought to the text and that time has since obscured.',
    'His research focuses on the relationship between narrative art and the Western philosophical tradition, especially the ways works of literature and film participate in philosophical argument rather than merely illustrating it. He writes on the philosophy embedded in narrative art for both academic and general audiences, working from the conviction that the ideas behind canonical works are neither obscure nor rarefied, but urgent and available to any serious reader.',
    'He studied at Tel Aviv University.',
  ],
}

export const SITE = {
  name: 'Heritage Canon',
  url: 'https://heritagecanon.com',
  description:
    'Classic literature with original philosophical introductions, presented as living arguments rather than museum pieces.',
}

export function getBooks(): Book[] {
  return [...payload.books].sort((a, b) => a.title.localeCompare(b.title))
}

export function getBook(slug: string): Book | undefined {
  return payload.books.find((book) => book.slug === slug)
}

export function getAuthors(books: Book[]): string[] {
  return [...new Set(books.map((book) => book.author))].sort((a, b) =>
    a.localeCompare(b),
  )
}

export function getFormats(books: Book[]): string[] {
  return [...new Set(books.flatMap((book) => book.formats))]
}

export function getRelatedBooks(slug: string, limit = 3): Book[] {
  const current = getBook(slug)
  if (!current) return getBooks().slice(0, limit)
  const others = getBooks().filter((book) => book.slug !== slug)
  return others
    .sort((a, b) => {
      const aScore =
        Number(a.author === current.author) * 2 +
        Number(a.formats.includes('hardcover'))
      const bScore =
        Number(b.author === current.author) * 2 +
        Number(b.formats.includes('hardcover'))
      return bScore - aScore || a.title.localeCompare(b.title)
    })
    .slice(0, limit)
}

export function getFeaturedBooks(limit = 6): Book[] {
  const preferred = [
    'the_great_gatsby',
    'death_in_venice',
    'moby_dick',
    'arrowsmith',
    'the_wendigo',
    'the_willows',
  ]
  const bySlug = new Map(getBooks().map((book) => [book.slug, book]))
  const chosen = preferred
    .map((slug) => bySlug.get(slug))
    .filter((book): book is Book => Boolean(book))
  if (chosen.length >= limit) return chosen.slice(0, limit)
  for (const book of getBooks()) {
    if (!chosen.find((item) => item.slug === book.slug)) {
      chosen.push(book)
    }
    if (chosen.length === limit) break
  }
  return chosen
}
