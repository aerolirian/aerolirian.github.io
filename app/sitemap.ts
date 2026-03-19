import type { MetadataRoute } from 'next'

import { EDITOR, SITE, getAuthorRecords, getBooks } from '@/lib/catalog'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/impressum`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/privacy`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/cookies`, changeFrequency: 'monthly', priority: 0.4 },
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

  for (const author of getAuthorRecords()) {
    pages.push({
      url: `${SITE.url}/authors/${author.slug}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  return pages
}
