'use client'

import { useMemo, useState } from 'react'

import type { Book } from '@/lib/catalog'
import { BookTile } from '@/components/book-tile'

type CatalogBrowserProps = {
  books: Book[]
  authors: string[]
  formats: string[]
}

export function CatalogBrowser({
  books,
  authors,
  formats,
}: CatalogBrowserProps) {
  const [query, setQuery] = useState('')
  const [author, setAuthor] = useState('all')
  const [format, setFormat] = useState('all')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return books.filter((book) => {
      const haystack = [
        book.title,
        book.author,
        book.thesis_subtitle,
        book.full_title,
      ]
        .join(' ')
        .toLowerCase()
      const matchesQuery = !needle || haystack.includes(needle)
      const matchesAuthor = author === 'all' || book.author === author
      const matchesFormat = format === 'all' || book.formats.includes(format)
      return matchesQuery && matchesAuthor && matchesFormat
    })
  }, [author, books, format, query])

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="top-28 h-fit rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm lg:sticky">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#d0a85c]">
          Browse
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-[0.92] text-white">
          Find the edition fast.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Search by title, thesis, or author. Filter by format without leaving
          the page.
        </p>
        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Moby Dick, Blackwood, desire..."
              className="w-full rounded-2xl border border-white/10 bg-[#0d1016] px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-[#d0a85c]/50"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Author
            </span>
            <select
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0d1016] px-4 py-3 text-sm text-white outline-none focus:border-[#d0a85c]/50"
            >
              <option value="all">All authors</option>
              {authors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Format
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFormat('all')}
                className={`rounded-full px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition ${
                  format === 'all'
                    ? 'bg-[#d0a85c] text-[#111318]'
                    : 'border border-white/10 bg-white/[0.04] text-zinc-300'
                }`}
              >
                All
              </button>
              {formats.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormat(item)}
                  className={`rounded-full px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition ${
                    format === item
                      ? 'bg-[#d0a85c] text-[#111318]'
                      : 'border border-white/10 bg-white/[0.04] text-zinc-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Current catalog
            </p>
            <h3 className="mt-2 font-serif text-3xl leading-[0.94] text-white">
              {filtered.length} editions currently available
            </h3>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((book) => (
            <BookTile key={book.slug} book={book} />
          ))}
        </div>
      </div>
    </div>
  )
}
