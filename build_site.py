#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONTENT_PATH = ROOT / 'content' / 'catalog.json'
PUBLIC_ASSETS = ROOT / 'public' / 'assets'
DIST_DIR = ROOT / 'dist'
ASSETS_DIR = DIST_DIR / 'assets'
BOOKS_DIR = DIST_DIR / 'books'
EDITOR_DIR = DIST_DIR / 'editor'
SITE_NAME = 'Heritage Canon'
SITE_URL = 'https://heritagecanon.com'
TAGLINE = 'Classic literature with original philosophical introductions.'
SERIES_BLURB = (
    'Heritage Canon publishes enduring works of literature alongside new philosophical essays '
    'that frame them as live intellectual encounters rather than period artifacts.'
)
FEATURED_SLUGS = ['the_great_gatsby', 'death_in_venice', 'moby_dick']
EDITOR_NAME = 'Daniel Shilansky'
EDITOR_SLUG = 'daniel-shilansky'
EDITOR_BIO = [
    'Daniel Shilansky is the editor of Heritage Canon, an independent press publishing philosophical editions of classic literature. Each edition includes an original critical introduction that reconstructs the intellectual world that shaped the work: the philosophical debates, historical pressures, and ways of reading that its first audience brought to the text and that time has since obscured.',
    'His research focuses on the relationship between narrative art and the Western philosophical tradition, especially the ways works of literature and film participate in philosophical argument rather than merely illustrating it. He writes on the philosophy embedded in narrative art for both academic and general audiences, working from the conviction that the ideas behind canonical works are neither obscure nor rarefied, but urgent and widely accessible.',
    'He studied at Tel Aviv University.',
]
FORMAT_ORDER = {'ebook': 0, 'paperback': 1, 'hardcover': 2, 'audiobook': 3}
FORMAT_LABELS = {
    'ebook': 'Kindle',
    'paperback': 'Paperback',
    'hardcover': 'Hardcover',
    'audiobook': 'Audiobook',
}


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


def safe_title(book: Book) -> str:
    return book.full_title or book.title


def format_badges(book: Book) -> str:
    ordered = sorted(book.formats, key=lambda item: FORMAT_ORDER.get(item, 99))
    return ''.join(f'<li>{html.escape(FORMAT_LABELS.get(fmt, fmt.title()))}</li>' for fmt in ordered)


def buy_buttons(book: Book) -> str:
    return ''.join(
        f'<a class="button button--primary button--buy" href="{html.escape(link["url"])}" target="_blank" rel="noreferrer">{html.escape(link["label"])}<span>Amazon</span></a>'
        for link in book.buy_links
    )


def page_shell(
    *,
    title: str,
    body_class: str,
    content: str,
    description: str,
    image_url: str | None = None,
    page_path: str = '/',
) -> str:
    og_image = image_url or f'{SITE_URL}/assets/heritage-canon-logo.png'
    page_url = f'{SITE_URL}{page_path}'
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
  <meta property="og:url" content="{html.escape(page_url)}" />
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


def authors(books: list[Book]) -> list[str]:
    return sorted({book.author for book in books})


def formats(books: list[Book]) -> list[str]:
    all_formats = {fmt for book in books for fmt in book.formats}
    return sorted(all_formats, key=lambda item: FORMAT_ORDER.get(item, 99))


def book_card(book: Book) -> str:
    meta = ' · '.join(x for x in [book.author, book.year, book.genre] if x)
    data_formats = ','.join(sorted(book.formats, key=lambda item: FORMAT_ORDER.get(item, 99)))
    return f'''
    <article class="book-card" data-search="{html.escape((book.title + ' ' + book.author + ' ' + book.thesis_subtitle).lower())}" data-author="{html.escape(book.author)}" data-formats="{html.escape(data_formats)}">
      <a class="book-card__cover" href="/books/{book.slug}/"><img src="{book.cover_out}" alt="Cover of {html.escape(book.title)}" loading="lazy" /></a>
      <div class="book-card__body">
        <p class="book-card__eyebrow">{html.escape(book.author)}</p>
        <h3><a href="/books/{book.slug}/">{html.escape(book.title)}</a></h3>
        <p class="book-card__subtitle">{html.escape(book.thesis_subtitle)}</p>
        <p class="book-card__meta">{html.escape(meta)}</p>
        <ul class="format-badges">{format_badges(book)}</ul>
        <a class="book-card__link" href="/books/{book.slug}/">View edition</a>
      </div>
    </article>
    '''


def build_home(books: list[Book]) -> str:
    featured = featured_books(books)
    author_list = authors(books)
    format_list = formats(books)
    featured_panels = ''.join(
        f'''
        <article class="hero-panel">
          <a class="hero-panel__cover" href="/books/{book.slug}/"><img src="{book.cover_out}" alt="Cover of {html.escape(book.title)}" /></a>
          <div class="hero-panel__body">
            <p>{html.escape(book.author)}</p>
            <h3><a href="/books/{book.slug}/">{html.escape(book.title)}</a></h3>
            <span>{html.escape(book.thesis_subtitle)}</span>
          </div>
        </article>
        ''' for book in featured
    )
    card_markup = ''.join(book_card(book) for book in books)
    author_options = ''.join(f'<option value="{html.escape(author)}">{html.escape(author)}</option>' for author in author_list)
    format_filters = ''.join(
        f'<button class="filter-pill" type="button" data-format-filter="{html.escape(fmt)}">{html.escape(FORMAT_LABELS.get(fmt, fmt.title()))}</button>'
        for fmt in format_list
    )
    return page_shell(
        title=f'{SITE_NAME} | {TAGLINE}',
        body_class='page-home',
        description=SERIES_BLURB,
        image_url=f'{SITE_URL}{featured[0].cover_out}' if featured else None,
        page_path='/',
        content=f'''
<header class="site-header">
  <a class="brand" href="/">
    <img src="/assets/heritage-canon-logo.png" alt="Heritage Canon logo" />
    <span>Heritage Canon</span>
  </a>
  <nav>
    <a href="/about/">About</a>
    <a href="/editor/{EDITOR_SLUG}/">Editor</a>
    <a href="#catalog">Catalog</a>
  </nav>
</header>
<main>
  <section class="hero">
    <div class="hero__copy">
      <p class="hero__kicker">Philosophical Editions</p>
      <h1>Classic literature with a visible argument.</h1>
      <p class="hero__lede">{html.escape(SERIES_BLURB)}</p>
      <div class="hero__actions">
        <a class="button button--primary" href="#catalog">Browse available editions</a>
        <a class="button button--ghost" href="/editor/{EDITOR_SLUG}/">Meet the editor</a>
      </div>
      <dl class="hero-stats">
        <div><dt>Available editions</dt><dd>{len(books)}</dd></div>
        <div><dt>Authors</dt><dd>{len(author_list)}</dd></div>
        <div><dt>Formats</dt><dd>{len(format_list)}</dd></div>
      </dl>
    </div>
    <div class="hero__stage">
      <div class="hero__stack">
        <a class="hero-cover hero-cover--1" href="/books/{featured[0].slug}/" aria-label="{html.escape(featured[0].title)}"><img src="{featured[0].cover_out}" alt="Cover of {html.escape(featured[0].title)}" /></a>
        <a class="hero-cover hero-cover--2" href="/books/{featured[1].slug}/" aria-label="{html.escape(featured[1].title)}"><img src="{featured[1].cover_out}" alt="Cover of {html.escape(featured[1].title)}" /></a>
        <a class="hero-cover hero-cover--3" href="/books/{featured[2].slug}/" aria-label="{html.escape(featured[2].title)}"><img src="{featured[2].cover_out}" alt="Cover of {html.escape(featured[2].title)}" /></a>
      </div>
      <div class="hero-panels">{featured_panels}</div>
    </div>
  </section>

  <section id="about" class="section-shell statement statement--home">
    <div class="section-head">
      <p class="section-head__kicker">Series Logic</p>
      <h2>The title stays primary. The subtitle states the claim.</h2>
    </div>
    <div class="statement__grid">
      <p>Each Heritage Canon edition keeps the original work title intact and pairs it with a thesis subtitle that names the philosophical pressure point of the book. The point is not decorative branding. It is an editorial claim about what the work is doing and why it matters now.</p>
      <p>Every volume includes an original introduction by Daniel Shilansky that reconstructs the intellectual world of the text rather than reducing it to biography or plot summary. The catalog below only includes books that are already live on Amazon in at least one format.</p>
    </div>
  </section>

  <section id="catalog" class="catalog section-shell">
    <div class="section-head section-head--inline">
      <div>
        <p class="section-head__kicker">Current Catalog</p>
        <h2>{len(books)} editions currently available</h2>
      </div>
      <p class="catalog-note">Amazon links on each product page are format-specific and generated directly from the ASINs in the publication status files.</p>
    </div>
    <div class="catalog-toolbar">
      <label class="catalog-search">
        <span>Search</span>
        <input id="catalog-search" type="search" placeholder="Title, author, or thesis" />
      </label>
      <label class="catalog-search catalog-search--select">
        <span>Author</span>
        <select id="catalog-author">
          <option value="">All authors</option>
          {author_options}
        </select>
      </label>
    </div>
    <div class="filter-pills">
      <button class="filter-pill is-active" type="button" data-format-filter="all">All formats</button>
      {format_filters}
    </div>
    <div id="catalog-grid" class="catalog-grid">
      {card_markup}
    </div>
    <p id="catalog-empty" class="catalog-empty" hidden>No books match the current filters.</p>
  </section>
</main>
<footer class="site-footer">
  <p>Heritage Canon</p>
  <p><a href="/editor/{EDITOR_SLUG}/">Daniel Shilansky</a></p>
</footer>
''',
    )


def build_about(books: list[Book]) -> str:
    author_markup = ''.join(f'<li>{html.escape(author)}</li>' for author in authors(books))
    return page_shell(
        title='About | Heritage Canon',
        body_class='page-about',
        description=SERIES_BLURB,
        page_path='/about/',
        content=f'''
<header class="site-header site-header--tight">
  <a class="brand" href="/">
    <img src="/assets/heritage-canon-logo.png" alt="Heritage Canon logo" />
    <span>Heritage Canon</span>
  </a>
  <nav>
    <a href="/">Home</a>
    <a href="/editor/{EDITOR_SLUG}/">Editor</a>
    <a href="/#catalog">Catalog</a>
  </nav>
</header>
<main class="about-page">
  <section class="section-shell about-grid">
    <div>
      <div class="section-head">
        <p class="section-head__kicker">About Heritage Canon</p>
        <h2>Classic literature with stated philosophical stakes.</h2>
      </div>
      <div class="book-copy__prose">
        <p>{html.escape(SERIES_BLURB)}</p>
        <p>The editorial structure is consistent across formats. The work title remains primary. The thesis subtitle names the interpretive claim. The introduction then reconstructs the arguments, historical pressures, and inherited habits of reading that make the work legible again.</p>
        <p>The public website tracks only editions that are already live on Amazon in at least one format. It is a product catalog, not a speculative pipeline view.</p>
      </div>
    </div>
    <aside class="info-card">
      <p class="info-card__kicker">Current Scope</p>
      <h3>{len(books)} available editions</h3>
      <p>Published across {len(authors(books))} authors, with Kindle, paperback, hardcover, and audiobook links surfaced only when the ASIN exists.</p>
      <a class="button button--ghost" href="/editor/{EDITOR_SLUG}/">Read the editor bio</a>
    </aside>
  </section>
  <section class="section-shell">
    <div class="section-head">
      <p class="section-head__kicker">Authors in the Catalog</p>
      <h2>Current catalog.</h2>
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


def build_editor_page(books: list[Book]) -> str:
    editor_books = ''.join(
        f'''
        <article class="editor-book-card">
          <a href="/books/{book.slug}/"><img src="{book.cover_out}" alt="Cover of {html.escape(book.title)}" loading="lazy" /></a>
          <div>
            <h3><a href="/books/{book.slug}/">{html.escape(book.title)}</a></h3>
            <p>{html.escape(book.thesis_subtitle)}</p>
          </div>
        </article>
        ''' for book in featured_books(books) + [b for b in books if b.slug not in {f.slug for f in featured_books(books)}][:3]
    )
    bio_markup = ''.join(f'<p>{html.escape(paragraph)}</p>' for paragraph in EDITOR_BIO)
    image_block = '<img class="editor-portrait" src="/assets/bio.png" alt="Portrait of Daniel Shilansky" />' if (PUBLIC_ASSETS / 'bio.png').exists() else ''
    return page_shell(
        title=f'{EDITOR_NAME} | Heritage Canon',
        body_class='page-editor',
        description=EDITOR_BIO[0],
        page_path=f'/editor/{EDITOR_SLUG}/',
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
<main class="editor-page">
  <section class="section-shell editor-hero">
    <div class="editor-hero__media">{image_block}</div>
    <div class="editor-hero__copy">
      <p class="section-head__kicker">Editor</p>
      <h1>{EDITOR_NAME}</h1>
      <div class="book-copy__prose">{bio_markup}</div>
    </div>
  </section>
  <section class="section-shell">
    <div class="section-head">
      <p class="section-head__kicker">Selected Editions</p>
      <h2>Current Heritage Canon books with his introductions.</h2>
    </div>
    <div class="editor-book-grid">{editor_books}</div>
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
    desc_paras = [p.strip() for p in re.split(r'\n\s*\n', book.description) if p.strip()]
    prose_markup = ''.join(f'<p>{html.escape(p)}</p>' for p in desc_paras[:3])
    related_markup = ''.join(
        f'''
        <article class="related-card">
          <a href="/books/{other.slug}/"><img src="{other.cover_out}" alt="Cover of {html.escape(other.title)}" loading="lazy" /></a>
          <h3><a href="/books/{other.slug}/">{html.escape(other.title)}</a></h3>
          <p>{html.escape(other.thesis_subtitle)}</p>
        </article>
        ''' for other in related_books(books, book)
    )
    meta_pairs = [
        ('Author', book.author),
        ('Original publication', book.year),
        ('Genre', book.genre),
        ('Introduction', book.intro_author),
        ('Formats live on Amazon', ', '.join(FORMAT_LABELS.get(fmt, fmt.title()) for fmt in book.formats)),
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
        page_path=f'/books/{book.slug}/',
        content=f'''
<header class="site-header site-header--tight">
  <a class="brand" href="/">
    <img src="/assets/heritage-canon-logo.png" alt="Heritage Canon logo" />
    <span>Heritage Canon</span>
  </a>
  <nav>
    <a href="/">Home</a>
    <a href="/about/">About</a>
    <a href="/editor/{EDITOR_SLUG}/">Editor</a>
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
      <div class="book-purchase-card">
        <p class="book-purchase-card__kicker">Buy on Amazon</p>
        <div class="buy-button-row">{buy_buttons(book)}</div>
        <p class="book-purchase-card__note">Each button points to the format-specific Amazon listing generated from the live ASIN in the publication status file.</p>
      </div>
      <dl class="detail-meta">{meta_markup}</dl>
    </div>
  </section>

  <section class="section-shell book-detail-grid">
    <div class="book-copy">
      <div class="section-head">
        <p class="section-head__kicker">Edition Note</p>
        <h2>The thesis subtitle states the editorial claim.</h2>
      </div>
      <div class="book-copy__prose">{prose_markup}</div>
    </div>
    <aside class="editor-card">
      <p class="editor-card__kicker">Editor</p>
      <h3>{EDITOR_NAME}</h3>
      <p>Heritage Canon pairs each classic with an original philosophical introduction that reconstructs the world of argument around the text rather than treating it as inert cultural property.</p>
      <a class="button button--ghost" href="/editor/{EDITOR_SLUG}/">Read full bio</a>
    </aside>
  </section>

  <section class="section-shell related-books">
    <div class="section-head">
      <p class="section-head__kicker">More in the Catalog</p>
      <h2>Continue reading.</h2>
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
    urls = [
        SITE_URL + '/',
        SITE_URL + '/about/',
        SITE_URL + f'/editor/{EDITOR_SLUG}/',
    ] + [f'{SITE_URL}/books/{book.slug}/' for book in books]
    body = ''.join(f'<url><loc>{html.escape(url)}</loc></url>' for url in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{body}</urlset>\n'


def build_robots() -> str:
    return f'User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}/sitemap.xml\n'


def write_text(path: Path, text: str) -> None:
    ensure_dir(path.parent)
    path.write_text(text, encoding='utf-8')


def main() -> None:
    ensure_dir(DIST_DIR)
    ensure_dir(ASSETS_DIR)
    ensure_dir(BOOKS_DIR)
    ensure_dir(EDITOR_DIR)

    shutil.copy2(ROOT / 'src' / 'site.css', ASSETS_DIR / 'site.css')
    shutil.copy2(ROOT / 'src' / 'site.js', ASSETS_DIR / 'site.js')
    shutil.copy2(PUBLIC_ASSETS / 'heritage-canon-logo.png', ASSETS_DIR / 'heritage-canon-logo.png')
    if (PUBLIC_ASSETS / 'bio.png').exists():
        shutil.copy2(PUBLIC_ASSETS / 'bio.png', ASSETS_DIR / 'bio.png')

    cover_out_dir = ASSETS_DIR / 'covers'
    ensure_dir(cover_out_dir)
    for cover in (PUBLIC_ASSETS / 'covers').glob('*'):
        shutil.copy2(cover, cover_out_dir / cover.name)

    books = read_books()
    published_slugs = {book.slug for book in books}
    if BOOKS_DIR.exists():
        for existing in BOOKS_DIR.iterdir():
            if existing.is_dir() and existing.name not in published_slugs:
                shutil.rmtree(existing, ignore_errors=True)

    write_text(DIST_DIR / 'index.html', build_home(books))
    write_text(DIST_DIR / '404.html', build_home(books))
    write_text(DIST_DIR / 'about' / 'index.html', build_about(books))
    write_text(EDITOR_DIR / EDITOR_SLUG / 'index.html', build_editor_page(books))
    for book in books:
        write_text(BOOKS_DIR / book.slug / 'index.html', build_book_page(book, books))
    write_text(DIST_DIR / 'sitemap.xml', build_sitemap(books))
    write_text(DIST_DIR / 'robots.txt', build_robots())
    write_text(
        DIST_DIR / '_headers',
        '/*\n  X-Frame-Options: DENY\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: geolocation=(), microphone=(), camera=()\n',
    )


if __name__ == '__main__':
    main()
