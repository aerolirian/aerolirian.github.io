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
COVERS_DIR = SITE_ROOT / 'public' / 'assets' / 'covers'
ART_DIR = SITE_ROOT / 'public' / 'assets' / 'art'
LOGO_SRC = ROOT / 'assets-dont-delete' / 'heritage_canon_logo_white_notext.PNG'
LOGO_DEST = SITE_ROOT / 'public' / 'assets' / 'heritage-canon-logo.png'
BIO_SRC = ROOT / 'assets-dont-delete' / 'bio.png'
BIO_DEST = SITE_ROOT / 'public' / 'assets' / 'bio.webp'


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def clean_text(text: str) -> str:
    text = text.replace('\r', '')
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html.unescape(text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


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


def main() -> None:
    books = []
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    ART_DIR.mkdir(parents=True, exist_ok=True)
    if LOGO_SRC.exists():
        LOGO_DEST.parent.mkdir(parents=True, exist_ok=True)
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
        buy_links = published_links(pub_status)
        if not buy_links:
            continue
        data = read_json(book_path)
        slug = data['slug']
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
                'essay_url': (
                    data.get('essay_url')
                    or data.get('substack_essay_url')
                    or data.get('substack_url')
                    or ''
                ).strip(),
                'author': (data.get('author') or '').strip(),
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


if __name__ == '__main__':
    main()
