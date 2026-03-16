import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="site-header sticky top-0 z-40 border-b border-white/10 bg-[#07090d]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3 self-start">
          <Image
            src="/assets/heritage-canon-logo-black-notext.png"
            alt="Heritage Canon"
            width={36}
            height={36}
            className="site-mark h-9 w-9 object-contain"
          />
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-zinc-400">
              Heritage Canon
            </p>
            <p className="hidden text-sm text-zinc-500 sm:block">
              Philosophical editions of classic literature
            </p>
          </div>
        </Link>
        <nav className="flex w-full items-center justify-between gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-zinc-400 sm:w-auto sm:justify-end sm:gap-5 sm:text-[0.7rem] sm:tracking-[0.22em]">
          <Link href="/#catalog">Catalog</Link>
          <Link href="/editor/daniel-shilansky">Editor</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  )
}
