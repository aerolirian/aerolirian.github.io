# heritagecanon-site

Next.js site for `https://heritagecanon.com`.

## Stack

- `Next.js 15`
- static export to GitHub Pages
- catalog data synced from `../books`
- book art sourced from each slug's `cover_image/cover_generated.png`
- Amazon buy links sourced from each slug's `pub_status.json`
- Amazon storefront eligibility derived during catalog sync from each book's `pub_status.json` and `copyright_data.json`

## Content rules

- only books with at least one live ASIN are published on the site
- display subtitle comes from `thesis_subtitle`
- metadata can still use `full_title`
- art cards use the centered `cover_image` asset
- book buy links are generated during sync and carry `verified_domains`
- runtime storefront fallback order is:
  - reader locale storefront if verified
  - otherwise `amazon.com` if verified
  - otherwise `amazon.co.uk` if verified
  - otherwise no buy link
- links with no verified storefronts are excluded from the published catalog
- optional essay links may come from source `book.json`
- preferred source schema:
  - `essays: [{ "label": "Substack", "url": "https://..." }]`
- supported legacy fallback keys:
  - `essay_url`
  - `substack_essay_url`
  - `substack_url`
- when essays exist, the book page shows labeled essay links and includes them as `ScholarlyArticle` entries in book-page JSON-LD

## Local workflow

Important:

- do not run `npm install`, `npm ci`, or `next build` from the Google Drive mount at `/home/ubuntu/gdrive/...`
- the mount can hang on `node_modules` and other heavy filesystem operations
- use a local clone on real disk instead, for example:
  - `/home/ubuntu/heritagecanon-site-local`
  - or a clone under `/tmp`

Refresh catalog data and web assets:

```bash
python3 scripts/sync_catalog.py
```

This also writes:

```bash
content/amazon_storefront_audit.json
```

Run sync again before deploy whenever any of these change:

- `books/<slug>/book.json`
- `books/<slug>/pub_status.json`
- `books/<slug>/copyright_data.json`

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build static export:

```bash
npm run build
```

## SEO / AEO / GEO

Implemented:

- canonical URLs
- `robots.txt`
- `sitemap.xml`
- JSON-LD for:
  - `Organization`
  - `WebSite`
  - `CollectionPage`
  - `Book`
  - `Person`
  - `BreadcrumbList`
- Search Console verification hook

Current route coverage:

- `/`
- `/about`
- `/editor/daniel-shilansky`
- `/books/[slug]`
- `/privacy`
- `/cookies`

## Analytics and consent

Implemented:

- open-source consent manager: `CookieConsent v3` by Orest Bida
- optional `Umami`
- optional `GA4`
- GA consent mode defaults to denied until consent

Analytics runs only if configured through environment variables.

### Environment variables

Create `.env.local` from this:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_SRC=
NEXT_PUBLIC_UMAMI_HOST_URL=
NEXT_PUBLIC_UMAMI_DOMAINS=heritagecanon.com,www.heritagecanon.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Recommended default:

- use `Umami` as primary analytics
- add `GA4` only if needed

## Deploy

GitHub Pages deploys from `.github/workflows/deploy-pages.yml`.

Live domain:

- `https://heritagecanon.com`

Push to `main`:

```bash
git push origin main
```

## Notes

- This repo is the website only.
- The source book workspace stays in `/home/ubuntu/gdrive/heritage_audiobooks/books`.
- If a book's art changes, rerun `python3 scripts/sync_catalog.py` and rebuild.
