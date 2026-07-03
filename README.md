# Atomic CFO — Astro site

Three static pages, fully pre-rendered HTML (SEO/AEO ready):

| Page | URL | Job |
|---|---|---|
| Home | `/` | Decision-quality positioning, services, about. No AI or productized-offer mentions. |
| Construction | `/construction/` | Industry landing page: job costing, WIP, bonding. FAQ schema included. |
| AI | `/ai/` | "AI as a tool, not a strategy" — linked quietly from nav and footer; not promoted in homepage content. |

## Run locally

```bash
npm install
npm run dev        # localhost:4321
npm run build      # outputs static HTML to dist/
```

## Deploy (same workflow as your current site)

1. Push this repo to GitHub.
2. In Vercel: New Project → import the repo. Vercel auto-detects Astro; no config needed.
3. Point your domain as before.

Note: `@astrojs/sitemap` is pinned to `3.1.6` — newer versions (3.7+) target Astro 5
and break the build under Astro 4. Don't bump it without also upgrading Astro.

## Before going live

- [ ] Add `public/headshot.jpg` (the About section references it)
- [ ] Confirm the Calendly URL in `src/components/Nav.astro` and `src/components/CtaBand.astro` (currently `calendly.com/jt-adlard/30min`)
- [ ] Review the FAQ answers on `/construction/` — they're written in your voice but you should verify the claims
- [ ] Add analytics (Vercel Analytics is one click in the dashboard, or drop Plausible/GA into `src/layouts/Base.astro`)
- [ ] When ready for content: create `src/pages/insights/` for teardown posts — Astro supports markdown pages natively, and that's the AEO play

## Structure

```
src/
  layouts/Base.astro      ← per-page <title>/<meta>, fonts, JSON-LD schema, nav+footer
  components/             ← Nav, Footer, CtaBand (shared)
  pages/                  ← one file = one URL, each with its own meta tags
  styles/global.css       ← brand tokens + shared classes; edit colors/type here
```

To change sitewide copy like the footer blurb, edit the component once.
To add a page, add a file to `src/pages/` — it gets its own URL, meta tags, and sitemap entry automatically.

## What's built in for SEO/AEO

- All content in raw static HTML (zero JS required to read the site — AI crawlers see everything)
- Per-page titles, descriptions, canonical URLs, Open Graph tags
- JSON-LD: ProfessionalService schema sitewide, FAQPage schema on /construction/
- `sitemap-index.xml` auto-generated, referenced in `robots.txt`
- robots.txt allows all crawlers including GPTBot/ClaudeBot/PerplexityBot
- Semantic HTML: real headings hierarchy, `<table>` for the WIP schedule, `<details>` for FAQs
