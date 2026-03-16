'use client'

export function CookiePreferencesButton() {
  const handleClick = () => {
    if (typeof window === 'undefined') return
    const cookieConsent = (
      window as Window & {
        CookieConsent?: { showPreferences: () => void }
      }
    ).CookieConsent
    cookieConsent?.showPreferences()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-zinc-500 transition hover:text-zinc-200"
    >
      Cookie preferences
    </button>
  )
}
