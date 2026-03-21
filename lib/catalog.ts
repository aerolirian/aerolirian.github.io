import authorMetadata from '@/content/author-metadata.json'
import catalog from '@/content/catalog.json'

export type BuyLink = {
  label: string
  format: 'ebook' | 'paperback' | 'hardcover' | 'audiobook' | string
  asin: string
  url: string
  price?: number | null
  price_currency?: string | null
  seller?: string | null
  item_condition?: string | null
  availability?: string | null
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
  intro_claim?: string
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
  art_card_out?: string
  art_hero_out?: string
  description: string
  excerpt: string
  formats: string[]
  prices?: Record<
    string,
    {
      amount?: number | null
      currency?: string | null
    }
  >
  buy_links: BuyLink[]
}

type CatalogPayload = {
  books: Book[]
}

const payload = catalog as CatalogPayload
const authorMetadataMap = authorMetadata as Record<string, AuthorMetadata>

type AuthorMetadata = {
  short_bio: string
  nationality: string
  period: string
  themes: string[]
}

export const EDITOR = {
  name: 'Daniel Shilansky',
  slug: 'daniel-shilansky',
  role: 'Editor, Heritage Canon',
  image: '/assets/bio.webp',
  bio: [
    'Daniel Shilansky is the editor of Heritage Canon, an independent press. The books currently featured on this site belong to the Philosophical Editions series, which pairs classic works with new introductions that reconstruct the intellectual world in which they first appeared.',
    'His research focuses on the relationship between narrative art and the Western philosophical tradition, especially the ways works of literature and film participate in philosophical argument rather than merely illustrating it. He writes on the philosophy embedded in narrative art for both academic and general audiences, on the conviction that the arguments in canonical works are neither obscure nor rarefied, but live and available to any serious reader.',
    'He studied at Tel Aviv University.',
  ],
}

export const SITE = {
  name: 'Heritage Canon',
  url: 'https://heritagecanon.com',
  description:
    'Heritage Canon is an independent press. The books currently featured on this site belong to the Philosophical Editions series.',
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
  shortBio: string
  nationality: string
  period: string
  themes: string[]
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

function getRequiredAuthorMetadata(name: string): AuthorMetadata {
  const metadata = authorMetadataMap[name]
  if (
    !metadata ||
    !metadata.short_bio?.trim() ||
    !metadata.nationality?.trim() ||
    !metadata.period?.trim() ||
    !Array.isArray(metadata.themes) ||
    metadata.themes.length === 0
  ) {
    throw new Error(`Missing required author metadata for ${name}`)
  }
  return metadata
}

export function getAuthorRecords(books = getBooks()): AuthorRecord[] {
  const byAuthor = new Map<string, AuthorRecord>()

  for (const book of books) {
    const existing = byAuthor.get(book.author)
    const birthYear = toYearNumber(book.author_birth_year)
    const deathYear = toYearNumber(book.author_death_year)
    const metadata = getRequiredAuthorMetadata(book.author)

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
      shortBio: metadata.short_bio,
      nationality: metadata.nationality,
      period: metadata.period,
      themes: metadata.themes,
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

function stableIndex(seed: string, size: number) {
  if (size <= 0) return 0
  let hash = 0
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash % size
}

function takeRotated(pool: Book[], seed: string, limit: number, used: Set<string>) {
  if (limit <= 0 || pool.length === 0) return []
  const start = stableIndex(seed, pool.length)
  const rotated = [...pool.slice(start), ...pool.slice(0, start)]
  const picked: Book[] = []
  for (const book of rotated) {
    if (used.has(book.slug)) continue
    picked.push(book)
    used.add(book.slug)
    if (picked.length === limit) break
  }
  return picked
}

export function getRelatedBooks(slug: string, limit = 3): Book[] {
  const current = getBook(slug)
  if (!current) return getBooks().slice(0, limit)
  const others = getBooks().filter((book) => book.slug !== slug)
  const used = new Set<string>()
  const related: Book[] = []

  const sameAuthor = others
    .filter((book) => book.author === current.author)
    .sort((a, b) => a.title.localeCompare(b.title))
  related.push(...takeRotated(sameAuthor, `${slug}:author`, 1, used))

  const similar = others
    .filter(
      (book) =>
        !used.has(book.slug) &&
        (book.genre === current.genre ||
          book.formats.some((format) => current.formats.includes(format))),
    )
    .sort((a, b) => a.title.localeCompare(b.title))
  related.push(...takeRotated(similar, `${slug}:similar`, limit - related.length, used))

  const remainder = others
    .filter((book) => !used.has(book.slug))
    .sort((a, b) => a.title.localeCompare(b.title))
  related.push(...takeRotated(remainder, `${slug}:remainder`, limit - related.length, used))

  return related.slice(0, limit)
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
