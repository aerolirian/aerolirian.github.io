#!/usr/bin/env python3
from __future__ import annotations

import base64
import json
import subprocess
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path('/home/ubuntu/gdrive/heritage_audiobooks')
SITE_ROOT = Path(__file__).resolve().parent.parent
BOOKS_DIR = ROOT / 'books'
OUTPUT_DIR = SITE_ROOT / 'public' / 'assets' / 'catalog-ai'
CONFIG_PATH = Path('/home/ubuntu/.heritage_audiobooks.json')

PROMPT = (
    'Reframe this existing book art for a premium literary catalog card. '
    'Keep the original artwork, palette, subject, and style faithful. '
    'Extend or adapt the composition horizontally so it works as a refined wide '
    'card image. Do not add any text, logos, borders, mockup elements, or typography. '
    'Preserve the original mood. Leave enough calm space near the lower portion '
    'for interface text overlay.'
)

TARGET_RATIO = 283 / 208


def get_openai_key() -> str:
    data = json.loads(CONFIG_PATH.read_text(encoding='utf-8'))
    return data['openai_api_key']


def read_published_slugs() -> list[str]:
    slugs: list[str] = []
    for book_dir in sorted(BOOKS_DIR.iterdir()):
        if not book_dir.is_dir():
            continue
        status_path = book_dir / 'status.json'
        pub_path = book_dir / 'pub_status.json'
        book_path = book_dir / 'book.json'
        if not status_path.exists() or not pub_path.exists() or not book_path.exists():
            continue
        status = json.loads(status_path.read_text(encoding='utf-8'))
        if not status.get('epub_approved'):
            continue
        pub = json.loads(pub_path.read_text(encoding='utf-8'))
        if not any(pub.get(key) for key in ('kdp_ebook_asin', 'kdp_paperback_asin', 'kdp_hardcover_asin', 'audiobook_audible_asin')):
            continue
        book = json.loads(book_path.read_text(encoding='utf-8'))
        slugs.append(book['slug'])
    return slugs


def source_image(slug: str) -> Path:
    path = BOOKS_DIR / slug / 'cover_image' / 'cover_generated.png'
    if path.exists():
        return path
    jpg = BOOKS_DIR / slug / 'cover_image' / 'cover_generated.jpg'
    if jpg.exists():
        return jpg
    raise FileNotFoundError(f'No cover image for {slug}')


def decode_and_crop(raw_json: str) -> Image.Image:
    payload = json.loads(raw_json)
    image_bytes = base64.b64decode(payload['data'][0]['b64_json'])
    image = Image.open(BytesIO(image_bytes)).convert('RGB')
    width, height = image.size
    target_width = int(round(height * TARGET_RATIO))
    if target_width <= width:
        left = (width - target_width) // 2
        image = image.crop((left, 0, left + target_width, height))
    else:
        target_height = int(round(width / TARGET_RATIO))
        top = (height - target_height) // 2
        image = image.crop((0, top, width, top + target_height))
    return image


def generate_one(slug: str, api_key: str) -> None:
    src = source_image(slug)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUTPUT_DIR / f'{slug}.webp'
    if out.exists():
        print(f'{slug} -> skipped')
        return
    result = subprocess.run(
        [
            'curl',
            '-sS',
            '-X',
            'POST',
            'https://api.openai.com/v1/images/edits',
            '-H',
            f'Authorization: Bearer {api_key}',
            '-F',
            'model=gpt-image-1-mini',
            '-F',
            'quality=low',
            '-F',
            'size=1536x1024',
            '-F',
            'output_format=png',
            '-F',
            f'prompt={PROMPT}',
            '-F',
            f'image=@{src}',
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    image = decode_and_crop(result.stdout)
    image.save(out, format='WEBP', quality=86, method=6)
    print(f'{slug} -> {out.name}')


def main() -> None:
    api_key = get_openai_key()
    for slug in read_published_slugs():
        generate_one(slug, api_key)


if __name__ == '__main__':
    main()
