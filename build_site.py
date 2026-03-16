#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from textwrap import shorten

ROOT = Path(__file__).resolve().parent
CONTENT_PATH = ROOT / 'content' / 'catalog.json'
PUBLIC_ASSETS = ROOT / 'public' / 'assets'
DIST_DIR = ROOT / 'dist'
ASSETS_DIR = DIST_DIR / 'assets'
BOOKS_DIR = DIST_DIR / 'books'
SITE_NAME = 'Heritage Canon'
SITE_URL = 'https://heritagecanon.com'
TAGLINE = 'Classic literature with original philosophical introductions.'
SERIES_BLURB = (
    'Heritage Canon publishes enduring works of literature alongside new philosophical essays '
    'that frame them as live intellectual encounters rather than period artifacts.'
)
FEATURED_SLUGS = ['the_great_gatsby', 'death_in_venice', 'moby_dick']


@dataclass
class Book:
    slug: str
    title: str
    full_title: str
    thesis_subtitle: str
    author: str
    intro_author: str
    genre: str
    year: str
    publisher: str
    cover_out: str
    description: str
    excerpt: str
    formats: list[str]
    buy_links: list[dict]


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def read_books() -> list[Book]:
    payload = json.loads(CONTENT_PATH.read_text(encoding='utf-8'))
    books = [Book(**entry) for entry in payload.get('books', [])]
    books.sort(key=lambda book: (book.author.lower(), book.title.lower()))
    return books


def format_badges(book: Book) -> str:
    return ''.join(f'<li>{html.escape(fmt)}</li>' for fmt in book.formats)


def buy_buttons(book: Book) -> str:
    return ''.join(
        f'<a class="button button--primary button--buy" href="{html.escape(link["url"])}" target="_blank" rel="noreferrer">{html.escape(link["label"])}</a>'
        for link in book.buy_links
    )


def safe_title(book: Book) -> str:
    return book.full_title or book.title


def page_shell(title: str, body_class: str, content: str, description: str, image_url: str | None = None) -> str:
    og_image = image_url or f'{SITE_URL}/assets/heritage-canon-logo.png'
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/site.css" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{SITE_URL}" />
  <meta property="og:image" content="{html.escape(og_image)}" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body class="{body_class}">
{content}
<script src="/assets/site.js"></script>
</body>
</html>
'''


def featured_books(books: list[Book]) -> list[Book]:
    by_slug = {book.slug: book for book in books}
    featured = [by_slug[slug] for slug in FEATURED_SLUGS if slug in by_slug]
    if len(featured) < 3:
        for book in books:
            if book not in featured:
                featured.append(book)
            if len(featured) == 3:
                break
    return featured


def build_home(books: list[Book]) -> str:
    featured = featured_books(books)
    book_cards = []
    for book in books:
        meta = ' · '.join(x for x in [book.author, book.year, book.genre] if x)
        book_cards.append(f'''
        <article class="book-card" data-search="{html.escape((book.title + ' ' + book.author + ' ' + book.thesis_subtitle).lower())}">
          <a class="book-card__cover" href="/books/{book.slug}/"><img src="{book.cover_out}" alt="Cover of {html.escape(book.title)}" loading="lazy" /></a>
          <div class="book-card__body">
            <p class="book-card__eyebrow">{html.escape(book.author)}</p>
            <h3><a href="/books/{book.slug}/">{html.escape(book.title)}</a></h3>
            <p class="book-card__subtitle">{html.escape(book.thesis_subtitle)}</p>
            <p class="book-card__meta">{html.escape(meta)}</p>
            <ul class="format-badges">{format_badges(book)}</ul>
          </div>
        </article>
        ''')
    featured_markup = []
    for idx, book in enumerate(featured):
        featured_markup.append(f'''
          <a class="hero-cover hero-cover--{idx+1}" href="/books/{book.slug}/" aria-label="{html.escape(book.title)}">
            <img src="{book.cover_out}" alt="Cover of {html.escape(book.title)}" />
          </a>
        ''')
    return page_shell(
        title=f'{SITE_NAME} | {TAGLINE}',
        body_class='page-home',
        description=SERIES_BLURB,
        image_url=f'{SITE_URL}{featured[0].cover_out}' if featured else None,
        content=f'''
<header class="site-header">
  <a class="brand" href="/">
    <img src="/assets/heritage-canon-logo.png" alt="Heritage Canon logo" />
    <span>Heritage Canon</span>
  </a>
  <nav>
    <a href="/about/">About</a>
    <a href="#about">Series</a>
    <a href="#catalog">Catalog</a>
  </nav>
</header>
<main>
  <section class="hero">
    <div class="hero__copy">
      <p class="hero__kicker">Philosophical Editions</p>
      <h1>Classics that argue with the present.</h1>
      <p class="hero__lede">{html.escape(SERIES_BLURB)}</p>
      <div class="hero__actions">
        <a class="button button--primary" href="#catalog">Browse the catalog</a>
        <a class="button button--ghost" href="#about">Read the series statement</a>
      </div>
    </div>
    <div class="hero__covers">{''.join(featured_markup)}</div>
  </section>

  <section id="about" class="statement section-shell">
    <div class="section-head">
      <p class="section-head__kicker">The Project</p>
      <h2>Literary editions built around a thesis, not a summary.</h2>
    </div>
    <div class="statement__grid">
      <p>Each Heritage Canon edition pairs a public-domain classic with a substantial new philosophical introduction by Daniel Shilansky. The goal is not to historicize the text into safety, but to recover the live argument inside it.</p>
      <p>The cover, the ebook title page, and the introduction all work from the same structure: the original work title remains primary, and the thesis subtitle states the pressure point that makes the book newly legible.</p>
    </div>
  </section>

  <section id="catalog" class="catalog section-shell">
    <div class="section-head section-head--inline">
      <div>
        <p class="section-head__kicker">Catalog</p>
        <h2>{len(books)} approved editions</h2>
      </div>
      <label class="catalog-search">
        <span>Search</span>
        <input id="catalog-search" type="search" placeholder="Title, author, or thesis" />
      </label>
    </div>
    <div id="catalog-grid" class="catalog-grid">
      {''.join(book_cards)}
    </div>
  </section>
</main>
<footer class="site-footer">
  <p>Heritage Canon</p>
  <p>heritagecanon.com</p>
</footer>
''',
    )


def build_about(books: list[Book]) -> str:
    authors = sorted({book.author for book in books})
    author_markup = ''.join(f'<li>{html.escape(author)}</li>' for author in authors)
    return page_shell(
        title='About | Heritage Canon',
        body_class='page-about',
        description=SERIES_BLURB,
        content=f'''
<header class="site-header site-header--tight">
  <a class="brand" href="/">
    <img src="/assets/heritage-canon-logo.png" alt="Heritage Canon logo" />
    <span>Heritage Canon</span>
  </a>
  <nav>
    <a href="/">Home</a>
    <a href="/#catalog">Catalog</a>
  </nav>
</header>
<main class="about-page">
  <section class="section-shell">
    <div class="section-head">
      <p class="section-head__kicker">About Heritage Canon</p>
      <h2>Classic literature with a stated argument.</h2>
    </div>
    <div class="statement__grid">
      <p>{html.escape(SERIES_BLURB)}</p>
      <p>The editorial structure is consistent across formats: the work title remains primary, the thesis subtitle names the interpretive claim, and the introduction makes the case directly. The catalog page only includes books that are already live on Amazon.</p>
    </div>
  </section>
  <section class="section-shell">
    <div class="section-head">
      <p class="section-head__kicker">Current Authors</p>
      <h2>{len(books)} published editions across {len(authors)} authors.</h2>
    </div>
    <ul class="author-list">{author_markup}</ul>
  </section>
</main>
<footer class="site-footer">
  <p>Heritage Canon</p>
  <p><a href="/">Back to catalog</a></p>
</footer>
''',
    )


def related_books(books: list[Book], current: Book) -> list[Book]:
    same_author = [book for book in books if book.author == current.author and book.slug != current.slug]
    if len(same_author) >= 3:
        return same_author[:3]
    pool = same_author + [book for book in books if book.slug != current.slug and book not in same_author]
    return pool[:3]


def build_book_page(book: Book, books: list[Book]) -> str:
    related = related_books(books, book)
    related_markup = ''.join(
        f'''
        <article class="related-card">
          <a href="/books/{other.slug}/"><img src="{other.cover_out}" alt="Cover of {html.escape(other.title)}" loading="lazy" /></a>
          <h3><a href="/books/{other.slug}/">{html.escape(other.title)}</a></h3>
          <p>{html.escape(other.thesis_subtitle)}</p>
        </article>
        ''' for other in related
    )
    desc_paras = [p.strip() for p in re.split(r'\n\s*\n', book.description) if p.strip()]
    desc_markup = ''.join(f'<p>{html.escape(p)}</p>' for p in desc_paras[:3])
    meta_pairs = [
        ('Author', book.author),
        ('Original publication', book.year),
        ('Genre', book.genre),
        ('Introduction', book.intro_author),
        ('Formats', ', '.join(book.formats)),
    ]
    meta_markup = ''.join(
        f'<div class="detail-meta__row"><dt>{html.escape(label)}</dt><dd>{html.escape(value)}</dd></div>'
        for label, value in meta_pairs if value
    )
    return page_shell(
        title=f'{safe_title(book)} | Heritage Canon',
        body_class='page-book',
        description=book.excerpt,
        image_url=f'{SITE_URL}{book.cover_out}',
        content=f'''
<header class="site-header site-header--tight">
  <a class="brand" href="/">
    <img src="/assets/heritage-canon-logo.png" alt="Heritage Canon logo" />
    <span>Heritage Canon</span>
  </a>
  <nav>
    <a href="/">Home</a>
    <a href="/about/">About</a>
    <a href="/#catalog">Catalog</a>
  </nav>
</header>
<main class="book-page">
  <section class="book-hero section-shell">
    <div class="book-hero__cover-wrap">
      <img class="book-hero__cover" src="{book.cover_out}" alt="Cover of {html.escape(book.title)}" />
    </div>
    <div class="book-hero__copy">
      <p class="hero__kicker">Philosophical Edition</p>
      <h1>{html.escape(book.title)}</h1>
      <p class="book-hero__subtitle">{html.escape(book.thesis_subtitle)}</p>
      <p class="book-hero__author">{html.escape(book.author)}</p>
      <ul class="format-badges">{format_badges(book)}</ul>
      <div class="buy-button-row">
        {buy_buttons(book)}
      </div>
      <dl class="detail-meta">{meta_markup}</dl>
    </div>
  </section>

  <section class="section-shell book-copy">
    <div class="section-head">
      <p class="section-head__kicker">Edition Note</p>
      <h2>A classic work with a thesis-driven introduction.</h2>
    </div>
    <div class="book-copy__prose">{desc_markup}</div>
  </section>

  <section class="section-shell related-books">
    <div class="section-head">
      <p class="section-head__kicker">Continue Reading</p>
      <h2>More from the catalog</h2>
    </div>
    <div class="related-grid">{related_markup}</div>
  </section>
</main>
<footer class="site-footer">
  <p>Heritage Canon</p>
  <p><a href="/">Back to catalog</a></p>
</footer>
''',
    )


def build_sitemap(books: list[Book]) -> str:
    urls = [SITE_URL + '/'] + [f'{SITE_URL}/books/{book.slug}/' for book in books]
    body = ''.join(f'<url><loc>{html.escape(url)}</loc></url>' for url in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{body}</urlset>\n'


def build_robots() -> str:
    return f'User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}/sitemap.xml\n'


def write_text(path: Path, text: str) -> None:
    ensure_dir(path.parent)
    path.write_text(text, encoding='utf-8')


def main() -> None:
    ensure_dir(ASSETS_DIR)
    ensure_dir(BOOKS_DIR)

    shutil.copy2(ROOT / 'src' / 'site.css', ASSETS_DIR / 'site.css')
    shutil.copy2(ROOT / 'src' / 'site.js', ASSETS_DIR / 'site.js')
    shutil.copy2(PUBLIC_ASSETS / 'heritage-canon-logo.png', ASSETS_DIR / 'heritage-canon-logo.png')
    cover_out_dir = ASSETS_DIR / 'covers'
    ensure_dir(cover_out_dir)
    for cover in (PUBLIC_ASSETS / 'covers').glob('*'):
        shutil.copy2(cover, cover_out_dir / cover.name)

    books = read_books()
    published_slugs = {book.slug for book in books}
    for existing in BOOKS_DIR.iterdir() if BOOKS_DIR.exists() else []:
        if existing.is_dir() and existing.name not in published_slugs:
            shutil.rmtree(existing, ignore_errors=True)
    write_text(DIST_DIR / 'index.html', build_home(books))
    write_text(DIST_DIR / '404.html', build_home(books))
    write_text(DIST_DIR / 'about' / 'index.html', build_about(books))
    for book in books:
        write_text(BOOKS_DIR / book.slug / 'index.html', build_book_page(book, books))
    write_text(DIST_DIR / 'sitemap.xml', build_sitemap(books))
    write_text(DIST_DIR / 'robots.txt', build_robots())
    write_text(DIST_DIR / '_headers', '/*\n  X-Frame-Options: DENY\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: geolocation=(), microphone=(), camera=()\n')


if __name__ == '__main__':
    main()
