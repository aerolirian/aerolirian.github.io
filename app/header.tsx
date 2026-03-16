import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090d]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/heritage-canon-logo.png"
            alt="Heritage Canon"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-zinc-400">
              Heritage Canon
            </p>
            <p className="text-sm text-zinc-500">
              Philosophical editions of classic literature
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-zinc-400">
          <Link href="/">Catalog</Link>
          <Link href="/editor/daniel-shilansky">Editor</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  )
}
