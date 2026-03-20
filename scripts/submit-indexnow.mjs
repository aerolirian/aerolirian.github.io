import catalog from '../content/catalog.json' with { type: 'json' }

const SITE_URL = 'https://heritagecanon.com'
const HOST = 'heritagecanon.com'
const KEY = '4d74f68ccaf6468fa4b65d6ee4d62ab1'
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const staticUrls = [
  SITE_URL,
  `${SITE_URL}/about`,
  `${SITE_URL}/impressum`,
  `${SITE_URL}/terms`,
  `${SITE_URL}/privacy`,
  `${SITE_URL}/cookies`,
  `${SITE_URL}/editor/daniel-shilansky`,
]

const bookUrls = catalog.books.map((book) => `${SITE_URL}/books/${book.slug}`)
const urlList = [...new Set([...staticUrls, ...bookUrls])]

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
})

const text = await response.text()

if (!response.ok) {
  console.error(`IndexNow failed: ${response.status} ${response.statusText}`)
  console.error(text)
  process.exit(1)
}

console.log(`IndexNow submitted ${urlList.length} URLs`)
if (text) console.log(text)
