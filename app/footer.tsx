import Link from 'next/link'

import { CookiePreferencesButton } from '@/components/cookie-preferences-button'

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-zinc-500 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p>Heritage Canon</p>
          <p>Philosophical editions of classic literature.</p>
          <p className="mt-1">
            <a href="mailto:daniel@heritagecanon.com" className="transition hover:text-zinc-200">
              daniel@heritagecanon.com
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/impressum" className="transition hover:text-zinc-200">
            Impressum
          </Link>
          <Link href="/privacy" className="transition hover:text-zinc-200">
            Privacy
          </Link>
          <Link href="/cookies" className="transition hover:text-zinc-200">
            Cookies
          </Link>
          <CookiePreferencesButton />
        </div>
      </div>
    </footer>
  )
}
