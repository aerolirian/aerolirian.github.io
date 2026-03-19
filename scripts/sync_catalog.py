#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
import shutil
from pathlib import Path
from textwrap import shorten

from PIL import Image

ROOT = Path('/home/ubuntu/gdrive/heritage_audiobooks')
BOOKS_DIR = ROOT / 'books'
SITE_ROOT = Path(__file__).resolve().parent.parent
CONTENT_PATH = SITE_ROOT / 'content' / 'catalog.json'
AMAZON_AUDIT_PATH = SITE_ROOT / 'content' / 'amazon_storefront_audit.json'
COVERS_DIR = SITE_ROOT / 'public' / 'assets' / 'covers'
ART_DIR = SITE_ROOT / 'public' / 'assets' / 'art'
LOGO_SRC = ROOT / 'assets-dont-delete' / 'heritage_canon_logo_white_notext.PNG'
LOGO_DEST = SITE_ROOT / 'public' / 'assets' / 'heritage-canon-logo.png'
BIO_SRC = ROOT / 'assets-dont-delete' / 'bio.png'
BIO_DEST = SITE_ROOT / 'public' / 'assets' / 'bio.webp'
AMAZON_DOMAINS = [
    'www.amazon.com',
    'www.amazon.ca',
    'www.amazon.com.mx',
    'www.amazon.com.br',
    'www.amazon.co.uk',
    'www.amazon.de',
    'www.amazon.fr',
    'www.amazon.it',
    'www.amazon.es',
    'www.amazon.nl',
    'www.amazon.se',
    'www.amazon.pl',
    'www.amazon.com.be',
    'www.amazon.com.tr',
    'www.amazon.ae',
    'www.amazon.sa',
    'www.amazon.eg',
    'www.amazon.sg',
    'www.amazon.com.au',
    'www.amazon.co.jp',
    'www.amazon.in',
]
STOREFRONT_TERRITORIES = {
    'www.amazon.com': {'US'},
    'www.amazon.ca': {'CA'},
    'www.amazon.com.mx': {'MX'},
    'www.amazon.com.br': {'BR'},
    'www.amazon.co.uk': {'GB', 'UK', 'IE'},
    'www.amazon.de': {'DE', 'AT', 'CH'},
    'www.amazon.fr': {'FR'},
    'www.amazon.it': {'IT'},
    'www.amazon.es': {'ES'},
    'www.amazon.nl': {'NL'},
    'www.amazon.se': {'SE'},
    'www.amazon.pl': {'PL'},
    'www.amazon.com.be': {'BE'},
    'www.amazon.com.tr': {'TR'},
    'www.amazon.ae': {'AE'},
    'www.amazon.sa': {'SA'},
    'www.amazon.eg': {'EG'},
    'www.amazon.sg': {'SG'},
    'www.amazon.com.au': {'AU', 'NZ'},
    'www.amazon.co.jp': {'JP'},
    'www.amazon.in': {'IN'},
}
ALL_STOREFRONT_TERRITORIES = set().union(*STOREFRONT_TERRITORIES.values())


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def clean_text(text: str) -> str:
    text = text.replace('\r', '')
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html.unescape(text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def normalize_match_text(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', ' ', text.lower()).strip()


def choose_cover(book_dir: Path, slug: str) -> Path | None:
    candidates = [
        book_dir / 'cover_art' / f'cover_{slug}.png',
        book_dir / 'apple_package' / f'cover_{slug}.jpg',
        book_dir / 'google_package' / f'cover_{slug}.jpg',
        book_dir / 'cover_image' / 'cover_generated.png',
    ]
    for path in candidates:
        if path.exists():
            return path
    return None


def export_cover(src: Path, slug: str) -> str:
    dest = COVERS_DIR / f'{slug}.webp'
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
        return f'/assets/covers/{slug}.webp'
    with Image.open(src) as image:
        cover = image.convert('RGB')
        target_width = 720
        if cover.width > target_width:
            target_height = int(round(cover.height * (target_width / cover.width)))
            cover = cover.resize((target_width, target_height), Image.LANCZOS)
        cover.save(dest, format='WEBP', quality=82, method=6)
    return f'/assets/covers/{slug}.webp'


def choose_art(book_dir: Path) -> Path | None:
    candidates = [
        book_dir / 'cover_image' / 'cover_generated.png',
        book_dir / 'cover_image' / 'cover_generated.jpg',
    ]
    for path in candidates:
        if path.exists():
            return path
    return None


def export_art(src: Path, slug: str) -> str:
    dest = ART_DIR / f'{slug}.webp'
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
        return f'/assets/art/{slug}.webp'
    with Image.open(src) as image:
        art = image.convert('RGB')
        target_width = 1400
        if art.width > target_width:
            target_height = int(round(art.height * (target_width / art.width)))
            art = art.resize((target_width, target_height), Image.LANCZOS)
        art.save(dest, format='WEBP', quality=86, method=6)
    return f'/assets/art/{slug}.webp'


def export_bio(src: Path) -> None:
    BIO_DEST.parent.mkdir(parents=True, exist_ok=True)
    if BIO_DEST.exists() and BIO_DEST.stat().st_mtime >= src.stat().st_mtime:
        return
    with Image.open(src) as image:
        bio = image.convert('RGB')
        target_width = 800
        if bio.width > target_width:
            target_height = int(round(bio.height * (target_width / bio.width)))
            bio = bio.resize((target_width, target_height), Image.LANCZOS)
        bio.save(BIO_DEST, format='WEBP', quality=84, method=6)


def normalize_site_description(text: str) -> str:
    text = clean_text(text)
    text = re.sub(
        r'^This philosophical edition(?: of [^:]+)? includes:\s*',
        '',
        text,
        flags=re.I,
    )
    text = re.sub(
        r'\s*The Heritage Canon Philosophical Editions series pairs classic works of literature.*$',
        '',
        text,
        flags=re.I,
    )
    return text.strip()


def split_sentences(text: str) -> list[str]:
    return [part.strip() for part in re.split(r'(?<=[.!?])\s+(?=[A-Z“"])', text) if part.strip()]


def chunk_sentences(text: str, target_chars: int = 360) -> list[str]:
    sentences = split_sentences(text)
    if len(sentences) <= 2:
        return [' '.join(sentences).strip()] if sentences else []

    paragraphs: list[str] = []
    current: list[str] = []
    current_len = 0

    for sentence in sentences:
        projected = current_len + (1 if current else 0) + len(sentence)
        if current and projected > target_chars and len(current) >= 2:
            paragraphs.append(' '.join(current).strip())
            current = [sentence]
            current_len = len(sentence)
        else:
            current.append(sentence)
            current_len = projected

    if current:
        paragraphs.append(' '.join(current).strip())

    if len(paragraphs) == 1 and len(sentences) >= 4:
        midpoint = len(sentences) // 2
        return [
            ' '.join(sentences[:midpoint]).strip(),
            ' '.join(sentences[midpoint:]).strip(),
        ]

    return paragraphs


def paragraphize_description(text: str) -> str:
    marker = 'This Heritage Canon Philosophical Edition includes'
    if marker in text:
        lead, intro = text.split(marker, 1)
        paragraphs = chunk_sentences(lead.strip())
        intro_text = f'{marker} {intro.strip()}'.strip()
        paragraphs.extend(chunk_sentences(intro_text))
        return '\n\n'.join(part for part in paragraphs if part)
    return '\n\n'.join(chunk_sentences(text))


def read_description(book_dir: Path) -> tuple[str, str]:
    candidates = [
        book_dir / 'kdp_package' / 'back_cover.txt',
        book_dir / 'kdp_package' / 'description.txt',
        book_dir / 'apple_package' / 'description.txt',
        book_dir / 'google_package' / 'description.txt',
    ]
    text = ''
    for path in candidates:
        if path.exists():
            raw = path.read_text(encoding='utf-8', errors='ignore').strip()
            if path.name == 'description.txt':
                paragraphs = re.findall(r'<p>(.*?)</p>', raw, re.S | re.I)
                if paragraphs:
                    text = '\n\n'.join(clean_text(p) for p in paragraphs if clean_text(p))
                else:
                    text = clean_text(raw)
            else:
                text = raw
            if text:
                break
    if not text:
        text = 'A Heritage Canon philosophical edition.'
    plain = normalize_site_description(text)
    paragraphized = paragraphize_description(plain)
    excerpt = shorten(clean_text(paragraphized), width=180, placeholder='...')
    return paragraphized, excerpt


def formats(book_dir: Path, status: dict) -> list[str]:
    items = []
    if (book_dir / 'epub').exists():
        items.append('ebook')
    if (book_dir / 'print' / 'paperback').exists():
        items.append('paperback')
    if (book_dir / 'print' / 'hardcover').exists():
        items.append('hardcover')
    if status.get('m4b_approved') or status.get('tts_complete'):
        items.append('audiobook')
    seen = []
    for item in items:
        if item not in seen:
            seen.append(item)
    return seen


def eligible_amazon_domains(book_dir: Path) -> list[str]:
    copyright_path = book_dir / 'copyright_data.json'
    if not copyright_path.exists():
        return AMAZON_DOMAINS

    data = read_json(copyright_path)
    mode = str(data.get('mode') or '').strip().lower()
    territories = {str(code).strip().upper() for code in data.get('territories') or [] if str(code).strip()}

    if not mode or not territories:
        return AMAZON_DOMAINS

    if mode == 'include':
        allowed_territories = territories
    elif mode == 'exclude':
        allowed_territories = ALL_STOREFRONT_TERRITORIES - territories
    else:
        return AMAZON_DOMAINS

    eligible = [
        domain
        for domain in AMAZON_DOMAINS
        if STOREFRONT_TERRITORIES.get(domain, set()) & allowed_territories
    ]

    return eligible or AMAZON_DOMAINS


def audit_buy_links(
    links: list[dict],
    title: str,
    author: str,
    eligible_domains: list[str],
) -> tuple[list[dict], list[dict]]:
    if not links:
        return [], []
    filtered_links = [
        {
            **link,
            'verified_domains': eligible_domains,
        }
        for link in links
        if eligible_domains
    ]
    audit_rows = [
        {
            'asin': link['asin'],
            'domain': domain,
            'url': f'https://{domain}/dp/{link["asin"]}',
            'status': 'eligible_by_rights',
        }
        for link in links
        for domain in eligible_domains
    ]
    return filtered_links, audit_rows


def published_links(pub_status: dict) -> list[dict]:
    mapping = [
        ('kdp_ebook_asin', 'Kindle', 'ebook'),
        ('kdp_paperback_asin', 'Paperback', 'paperback'),
        ('kdp_hardcover_asin', 'Hardcover', 'hardcover'),
        ('audiobook_audible_asin', 'Audiobook', 'audiobook'),
    ]
    links = []
    for key, label, fmt in mapping:
        asin = (pub_status.get(key) or '').strip()
        if not asin:
            continue
        links.append(
            {
                'label': label,
                'format': fmt,
                'asin': asin,
                'url': f'https://www.amazon.com/dp/{asin}',
            }
        )
    return links


def extract_essays(data: dict) -> list[dict]:
    essays = []

    raw_items = data.get('essays')
    if isinstance(raw_items, list):
        for item in raw_items:
            if not isinstance(item, dict):
                continue
            label = str(item.get('label') or '').strip()
            url = str(item.get('url') or '').strip()
            if not url:
                continue
            essays.append(
                {
                    'label': label or 'Essay',
                    'url': url,
                }
            )

    if essays:
        return essays

    legacy_url = (
        data.get('essay_url')
        or data.get('substack_essay_url')
        or data.get('substack_url')
        or ''
    ).strip()
    if legacy_url:
        return [{'label': 'Essay', 'url': legacy_url}]

    return []


def main() -> None:
    books = []
    amazon_audit = []
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    ART_DIR.mkdir(parents=True, exist_ok=True)
    if LOGO_SRC.exists():
        LOGO_DEST.parent.mkdir(parents=True, exist_ok=True)
        if not LOGO_DEST.exists() or LOGO_DEST.stat().st_mtime < LOGO_SRC.stat().st_mtime:
            shutil.copy2(LOGO_SRC, LOGO_DEST)
    if BIO_SRC.exists():
        export_bio(BIO_SRC)
    for book_dir in sorted(BOOKS_DIR.iterdir()):
        if not book_dir.is_dir():
            continue
        status_path = book_dir / 'status.json'
        book_path = book_dir / 'book.json'
        if not status_path.exists() or not book_path.exists():
            continue
        status = read_json(status_path)
        if not status.get('epub_approved'):
            continue
        pub_status = read_json(book_dir / 'pub_status.json') if (book_dir / 'pub_status.json').exists() else {}
        data = read_json(book_path)
        slug = data['slug']
        raw_buy_links = published_links(pub_status)
        if not raw_buy_links:
            continue
        eligible_domains = eligible_amazon_domains(book_dir)
        buy_links, audit_rows = audit_buy_links(
            raw_buy_links,
            (data.get('title') or slug.replace('_', ' ').title()).strip(),
            (data.get('author') or '').strip(),
            eligible_domains,
        )
        amazon_audit.extend(
            {
                'slug': slug,
                'title': (data.get('title') or slug.replace('_', ' ').title()).strip(),
                'author': (data.get('author') or '').strip(),
                'eligible_domains': eligible_domains,
                **row,
            }
            for row in audit_rows
        )
        if not buy_links:
            continue
        cover_src = choose_cover(book_dir, slug)
        if cover_src is None:
            continue
        art_src = choose_art(book_dir) or cover_src
        description, excerpt = read_description(book_dir)
        art_out = export_art(art_src, slug)
        books.append(
            {
                'slug': slug,
                'title': (data.get('title') or slug.replace('_', ' ').title()).strip(),
                'full_title': (data.get('full_title') or data.get('title') or '').strip(),
                'thesis_subtitle': (data.get('thesis_subtitle') or '').strip(),
                'essays': extract_essays(data),
                'author': (data.get('author') or '').strip(),
                'author_birth_year': data.get('author_birth_year'),
                'author_death_year': data.get('author_death_year'),
                'intro_author': (data.get('intro_author') or 'Daniel Shilansky').strip(),
                'genre': (data.get('genre') or '').strip(),
                'year': str(data.get('first_publication_year') or ''),
                'publisher': 'Heritage Canon',
                'cover_out': export_cover(cover_src, slug),
                'art_out': art_out,
                'description': description,
                'excerpt': excerpt,
                'formats': [link['format'] for link in buy_links],
                'buy_links': buy_links,
            }
        )
    CONTENT_PATH.write_text(json.dumps({'books': books}, ensure_ascii=False, indent=2), encoding='utf-8')
    AMAZON_AUDIT_PATH.write_text(
        json.dumps({'rows': amazon_audit}, ensure_ascii=False, indent=2),
        encoding='utf-8',
    )


if __name__ == '__main__':
    main()
