# heritagecanon-site

Static catalog site for `heritagecanon.com`.

## Local workflow

Sync fresh catalog data and optimized covers from the main books workspace:

```bash
python3 scripts/sync_catalog.py
```

Build the site:

```bash
python3 build_site.py
```

Serve locally:

```bash
python3 -m http.server 8787 --directory dist
```

## Hosting

Preferred: Cloudflare Pages
- Build command: `python3 build_site.py`
- Build output directory: `dist`
- Custom domain: `heritagecanon.com`

Fallback: Netlify
- Build command: `python3 build_site.py`
- Publish directory: `dist`

The repo is self-contained for deployment. `scripts/sync_catalog.py` is only for refreshing content from the local Heritage books workspace.
