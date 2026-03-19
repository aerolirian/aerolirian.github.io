import catalog from '@/content/catalog.json'

export type BuyLink = {
  label: string
  format: 'ebook' | 'paperback' | 'hardcover' | 'audiobook' | string
  asin: string
  url: string
  verified_domains?: string[]
}

export type EssayLink = {
  label: string
  url: string
}

export type Book = {
  slug: string
  title: string
  full_title: string
  thesis_subtitle: string
  essays?: EssayLink[]
  author: string
  author_birth_year?: number | null
  author_death_year?: number | null
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
    'Daniel Shilansky is the editor of Heritage Canon, a press publishing philosophical editions of classic literature. Each edition pairs the original work with a critical introduction that reconstructs the intellectual world that shaped it: the philosophical debates, historical pressures, and ways of reading that its first audience brought to the text and that time has since obscured.',
    'His research focuses on the relationship between narrative art and the Western philosophical tradition, especially the ways works of literature and film participate in philosophical argument rather than merely illustrating it. He writes on the philosophy embedded in narrative art for both academic and general audiences, on the conviction that the arguments in canonical works are neither obscure nor rarefied, but live and available to any serious reader.',
    'He studied at Tel Aviv University.',
  ],
}

export const SITE = {
  name: 'Heritage Canon',
  url: 'https://heritagecanon.com',
  description:
    'Classic literature with original philosophical introductions. Every edition argues a specific case about the work.',
  email: 'daniel@heritagecanon.com',
  legalName: 'Daniel Shilansky',
  imprint: 'Heritage Canon',
  address: {
    street: 'Kastanienallee 16',
    postalCode: '12627',
    city: 'Berlin',
    country: 'Germany',
  },
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

export type AuthorRecord = {
  name: string
  slug: string
  birthYear?: number
  deathYear?: number
  books: Book[]
}

function toYearNumber(value: number | string | null | undefined) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

export function slugifyPersonName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getAuthorHref(name: string) {
  return `/authors/${slugifyPersonName(name)}`
}

export function getAuthorRecords(books = getBooks()): AuthorRecord[] {
  const byAuthor = new Map<string, AuthorRecord>()

  for (const book of books) {
    const existing = byAuthor.get(book.author)
    const birthYear = toYearNumber(book.author_birth_year)
    const deathYear = toYearNumber(book.author_death_year)

    if (existing) {
      existing.books.push(book)
      if (existing.birthYear == null && birthYear != null) existing.birthYear = birthYear
      if (existing.deathYear == null && deathYear != null) existing.deathYear = deathYear
      continue
    }

    byAuthor.set(book.author, {
      name: book.author,
      slug: slugifyPersonName(book.author),
      birthYear,
      deathYear,
      books: [book],
    })
  }

  return [...byAuthor.values()]
    .map((author) => ({
      ...author,
      books: [...author.books].sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getAuthorBySlug(slug: string): AuthorRecord | undefined {
  return getAuthorRecords().find((author) => author.slug === slug)
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
    'the_wendigo',
    'the_willows',
    'a_portrait_of_the_artist_as_a_young_man',
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
