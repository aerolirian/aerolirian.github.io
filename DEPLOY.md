# Deploy to Cloudflare Pages

## 1. Push this repo

Create a remote repo, then push:

```bash
git remote add origin <your-repo-url>
git add .
git commit -m "Initial Heritage Canon site"
git push -u origin main
```

## 2. Create the Pages project

In Cloudflare Pages:
- `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`
- Select the `heritagecanon-site` repo

Build settings:
- Framework preset: `None`
- Build command: `python3 build_site.py`
- Build output directory: `dist`

## 3. Attach the domain

In the Pages project:
- `Custom domains` -> `Set up a custom domain`
- add `heritagecanon.com`
- add `www.heritagecanon.com` if you want both

If the domain is not already on Cloudflare DNS, Cloudflare will ask you to move the zone by changing nameservers at your registrar.

## 4. Refresh the catalog later

When more books are published on Amazon:

```bash
python3 scripts/sync_catalog.py
python3 build_site.py
git add .
git commit -m "Refresh published catalog"
git push
```

The site only includes titles whose `pub_status.json` has at least one ASIN.
