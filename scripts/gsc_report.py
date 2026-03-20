#!/usr/bin/env python3
from __future__ import annotations

import json
from datetime import date, timedelta
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build

PROPERTY = 'sc-domain:heritagecanon.com'
KEY_PATH = Path('/home/ubuntu/.secrets/search-console-service-account.json')
SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
OUTPUT_DIR = Path(__file__).resolve().parent.parent / 'reports' / 'search-console'
ROW_LIMIT = 25
DATA_DELAY_DAYS = 3
WINDOW_DAYS = 28


def daterange(window_days: int, delay_days: int) -> tuple[str, str]:
    end = date.today() - timedelta(days=delay_days)
    start = end - timedelta(days=window_days - 1)
    return start.isoformat(), end.isoformat()


def previous_daterange(start_iso: str, window_days: int) -> tuple[str, str]:
    start = date.fromisoformat(start_iso)
    prev_end = start - timedelta(days=1)
    prev_start = prev_end - timedelta(days=window_days - 1)
    return prev_start.isoformat(), prev_end.isoformat()


def get_service():
    creds = service_account.Credentials.from_service_account_file(
        str(KEY_PATH),
        scopes=SCOPES,
    )
    return build('searchconsole', 'v1', credentials=creds, cache_discovery=False)


def query_report(service, start_date: str, end_date: str, dimensions: list[str] | None = None, row_limit: int = ROW_LIMIT):
    body = {
        'startDate': start_date,
        'endDate': end_date,
        'rowLimit': row_limit,
    }
    if dimensions:
        body['dimensions'] = dimensions
    return service.searchanalytics().query(siteUrl=PROPERTY, body=body).execute()


def extract_summary(resp: dict) -> dict:
    rows = resp.get('rows') or []
    if not rows:
        return {'clicks': 0, 'impressions': 0, 'ctr': 0, 'position': 0}
    row = rows[0]
    return {
        'clicks': row.get('clicks', 0),
        'impressions': row.get('impressions', 0),
        'ctr': row.get('ctr', 0),
        'position': row.get('position', 0),
    }


def extract_rows(resp: dict, key_name: str) -> list[dict]:
    rows = []
    for row in resp.get('rows') or []:
        key = (row.get('keys') or [''])[0]
        rows.append(
            {
                key_name: key,
                'clicks': row.get('clicks', 0),
                'impressions': row.get('impressions', 0),
                'ctr': row.get('ctr', 0),
                'position': row.get('position', 0),
            }
        )
    return rows


def list_sitemaps(service) -> list[dict]:
    resp = service.sitemaps().list(siteUrl=PROPERTY).execute()
    return resp.get('sitemap') or []


def pct_change(current: float, previous: float) -> str:
    if previous == 0:
        return 'n/a'
    change = ((current - previous) / previous) * 100
    sign = '+' if change > 0 else ''
    return f'{sign}{change:.1f}%'


def format_md(report: dict) -> str:
    cur = report['current']
    prev = report['previous']
    lines = [
        '# Search Console Report',
        '',
        f"- Property: `{report['property']}`",
        f"- Range: `{report['start_date']}` to `{report['end_date']}`",
        f"- Previous range: `{report['previous_start_date']}` to `{report['previous_end_date']}`",
        '',
        '## Totals',
        '',
        f"- Clicks: `{cur['summary']['clicks']}` (`{pct_change(cur['summary']['clicks'], prev['summary']['clicks'])}` vs previous)",
        f"- Impressions: `{cur['summary']['impressions']}` (`{pct_change(cur['summary']['impressions'], prev['summary']['impressions'])}` vs previous)",
        f"- CTR: `{cur['summary']['ctr']:.4f}`",
        f"- Position: `{cur['summary']['position']:.2f}`",
        '',
        '## Top Pages',
        '',
    ]
    for row in cur['pages'][:10]:
        lines.append(f"- `{row['page']}` — {row['clicks']} clicks / {row['impressions']} impressions")
    lines.extend(['', '## Top Queries', ''])
    for row in cur['queries'][:10]:
        lines.append(f"- `{row['query']}` — {row['clicks']} clicks / {row['impressions']} impressions")
    lines.extend(['', '## Countries', ''])
    for row in cur['countries'][:10]:
        lines.append(f"- `{row['country']}` — {row['clicks']} clicks / {row['impressions']} impressions")
    lines.extend(['', '## Devices', ''])
    for row in cur['devices'][:10]:
        lines.append(f"- `{row['device']}` — {row['clicks']} clicks / {row['impressions']} impressions")
    lines.extend(['', '## Sitemaps', ''])
    for sitemap in report['sitemaps']:
        lines.append(
            f"- `{sitemap.get('path','')}` — submitted `{sitemap.get('lastSubmitted')}`, status `{sitemap.get('isPending') and 'pending' or 'processed'}`"
        )
    return '\n'.join(lines) + '\n'


def main() -> None:
    service = get_service()
    start_date, end_date = daterange(WINDOW_DAYS, DATA_DELAY_DAYS)
    previous_start, previous_end = previous_daterange(start_date, WINDOW_DAYS)

    current_summary = extract_summary(query_report(service, start_date, end_date))
    previous_summary = extract_summary(query_report(service, previous_start, previous_end))

    report = {
        'property': PROPERTY,
        'start_date': start_date,
        'end_date': end_date,
        'previous_start_date': previous_start,
        'previous_end_date': previous_end,
        'current': {
            'summary': current_summary,
            'pages': extract_rows(query_report(service, start_date, end_date, ['page']), 'page'),
            'queries': extract_rows(query_report(service, start_date, end_date, ['query']), 'query'),
            'countries': extract_rows(query_report(service, start_date, end_date, ['country']), 'country'),
            'devices': extract_rows(query_report(service, start_date, end_date, ['device']), 'device'),
        },
        'previous': {
            'summary': previous_summary,
        },
        'sitemaps': list_sitemaps(service),
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    stamp = date.today().isoformat()
    (OUTPUT_DIR / f'{stamp}.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUTPUT_DIR / f'{stamp}.md').write_text(format_md(report), encoding='utf-8')
    (OUTPUT_DIR / 'latest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUTPUT_DIR / 'latest.md').write_text(format_md(report), encoding='utf-8')
    print(f'wrote {OUTPUT_DIR / "latest.md"}')


if __name__ == '__main__':
    main()
