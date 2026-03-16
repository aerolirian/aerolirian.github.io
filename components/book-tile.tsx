import Image from 'next/image'
import Link from 'next/link'

import type { Book } from '@/lib/catalog'

type BookTileProps = {
  book: Book
  compact?: boolean
}

export function BookTile({ book, compact = false }: BookTileProps) {
  const art = book.catalog_art_out || book.art_out || book.cover_out

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#d0a85c]/35 hover:shadow-[0_30px_100px_rgba(0,0,0,0.38)]">
      <Link href={`/books/${book.slug}`} className="block">
        <div
          className={`relative isolate overflow-hidden [transform:translateZ(0)] ${compact ? 'h-40' : 'h-48 sm:h-52'}`}
        >
          <div className="absolute inset-[-2px] transform-gpu [backface-visibility:hidden] transition duration-500 will-change-transform group-hover:scale-[1.03]">
            <Image
              src={art}
              alt={book.title}
              fill
              className="object-cover"
              sizes={compact ? '(max-width: 768px) 100vw, 30vw' : '(max-width: 768px) 100vw, 33vw'}
            />
            <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#090b10] via-[#090b10]/72 to-transparent" />
          </div>
          <div className="absolute inset-x-5 bottom-5 flex items-end gap-4">
            <div>
              <p className="drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#d0a85c]">
                {book.author}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3 px-5 py-5">
          <div>
            <h3 className="max-w-[16ch] font-serif text-xl leading-[0.96] text-white sm:text-2xl">
              {book.title}
            </h3>
            <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-zinc-300">
              {book.thesis_subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {book.formats.map((format) => (
              <span
                key={format}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-300"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}
