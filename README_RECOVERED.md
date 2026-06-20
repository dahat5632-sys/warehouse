# bilalgurkansanli.com recovered static mirror

This folder is a static mirror recovered from the public website:

https://www.bilalgurkansanli.com/

Recovered on 2026-06-20.

## What is included

- Public HTML files, including the root page, `default-mode/`, and `pro-mode/`.
- Public CSS and JavaScript files.
- Public assets referenced by the site, including images, audio, videos, and GLB models.
- `robots.txt`, `sitemap.xml`, and `site.webmanifest`.

## What cannot be recovered from the published site

- Original Git commit history.
- Build tooling if it was not published.
- Pre-build component source, such as React/Vue/Svelte files, if the site was compiled before deployment.
- Private server-side code.
- Environment variables, secrets, or private deployment settings.

## Local preview

Serve this folder with any static file server from the folder root. For example:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

Some external dependencies are still loaded from their original public providers, such as Google Fonts, CDN-hosted GSAP, and Umami analytics.
