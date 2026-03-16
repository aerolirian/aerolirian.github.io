import type { MetadataRoute } from 'next'

import { EDITOR, SITE, getBooks } from '@/lib/catalog'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.7 },
    {
      url: `${SITE.url}/editor/${EDITOR.slug}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  for (const book of getBooks()) {
    pages.push({
      url: `${SITE.url}/books/${book.slug}`,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  return pages
}
