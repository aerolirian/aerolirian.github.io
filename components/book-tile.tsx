import Image from 'next/image'
import Link from 'next/link'

import type { Book } from '@/lib/catalog'

type BookTileProps = {
  book: Book
  compact?: boolean
}

export function BookTile({ book, compact = false }: BookTileProps) {
  const art = book.art_out || book.cover_out

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#d0a85c]/35">
      <Link href={`/books/${book.slug}`} className="block">
        <div className={`relative overflow-hidden ${compact ? 'h-40' : 'h-52'}`}>
          <Image
            src={art}
            alt={book.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes={compact ? '(max-width: 768px) 100vw, 30vw' : '(max-width: 768px) 100vw, 33vw'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/45 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#d0a85c]">
                {book.author}
              </p>
            </div>
            {!compact && (
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-2xl">
                <Image
                  src={book.cover_out}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3 px-5 py-5">
          <div>
            <h3 className="max-w-[16ch] font-serif text-2xl leading-[0.94] text-white">
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
