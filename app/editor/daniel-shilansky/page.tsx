import type { Metadata } from 'next'
import Image from 'next/image'

import { BookTile } from '@/components/book-tile'
import { EDITOR, getFeaturedBooks } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Daniel Shilansky',
  description: 'Editor of Heritage Canon.',
}

export default function EditorPage() {
  const books = getFeaturedBooks(6)

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-16 lg:px-8">
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
          <h1 className="mt-4 font-serif text-6xl leading-[0.9] tracking-[-0.04em] text-white">
            {EDITOR.name}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.22em] text-zinc-500">
            {EDITOR.role}
          </p>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-zinc-300">
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
        <h2 className="mt-4 max-w-[10ch] font-serif text-5xl leading-[0.92] tracking-[-0.04em] text-white">
          Current Heritage Canon books with his introductions.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookTile key={book.slug} book={book} compact />
          ))}
        </div>
      </section>
    </main>
  )
}
