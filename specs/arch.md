# Architecture: Jon Kloss Portfolio

## Overview

A statically-generated personal portfolio and blog built with Next.js App Router. All content (blog posts, project data, resume entries) lives in the repo as Markdown and JSON files, processed at build time into static HTML. The site deploys to GitHub Pages via GitHub Actions and uses Formspree for contact form submission, the only external runtime dependency.

## System Architecture

The system follows a **build-time rendering** model: all data is resolved during `next build`, producing a fully static site with zero server-side runtime. The only client-side dynamic behavior is theme toggling (localStorage), scroll-triggered animations (IntersectionObserver), and contact form submission (Formspree).

```
Content Layer          Build Layer              Runtime Layer
─────────────         ───────────              ─────────────
content/posts/*.md ──→ remark/rehype ──→ HTML
content/projects.json ──→ JSON parse  ──→ HTML   GitHub Pages
content/resume.json  ──→ JSON parse  ──→ HTML   (static files)
GitHub API (repos)   ──→ fetch at build ──→ HTML

                      next build                Browser
                      (static export)           ├─ Theme toggle (localStorage)
                                                ├─ Scroll reveals (IntersectionObserver)
                                                └─ Contact form → Formspree API
```

### Key architectural properties

1. **No server at runtime.** `output: 'export'` produces plain HTML/CSS/JS. GitHub Pages serves it as-is.
2. **Content as data.** Blog posts are Markdown with frontmatter; projects and resume are JSON. All processed at build time.
3. **GitHub API is optional.** If the API is unavailable at build time, the site builds without the open-source repos section. Curated projects are unaffected.
4. **One external dependency at runtime.** Formspree handles contact form submission. Everything else is static.

## Component Map

| Component | Responsibility | Depends On | Spec |
|-----------|---------------|------------|------|
| Root Layout | Shell with nav, footer, theme provider | — | site-layout.md |
| Nav | Fixed header, hide-on-scroll, theme toggle | ThemeProvider | site-layout.md |
| ThemeProvider | Dark/light state, localStorage, system preference | — | site-layout.md |
| Footer | Copyright, social links | — | site-layout.md |
| Home Page | Hero, featured projects, latest writing, contact | Blog, Projects, ContactForm | home-page.md |
| Blog Listing | List published posts, featured post treatment | posts.ts (lib) | blog.md |
| Blog Post | Render Markdown with syntax highlighting | posts.ts, rehype | blog.md |
| Projects Page | Curated projects + GitHub repos | projects.ts, github.ts (lib) | projects-showcase.md |
| About Page | Bio, social links | — | about-resume.md |
| Resume Page | Experience, skills, PDF download | — | about-resume.md |
| Contact Page | Formspree form with validation | — | contact-form.md |
| posts.ts | Read/parse Markdown, extract frontmatter | gray-matter, remark | blog.md |
| projects.ts | Load curated project data from JSON | — | projects-showcase.md |
| github.ts | Fetch public repos from GitHub API | GitHub REST API | projects-showcase.md |

## Data Flow

### Blog post lifecycle

```
content/posts/my-post.md
  → gray-matter extracts frontmatter (title, date, excerpt, tags)
  → remark parses Markdown to AST
  → rehype converts AST to HTML
  → rehype-pretty-code applies syntax highlighting
  → Next.js static page at /blog/my-post
```

### Contact form submission

```
User fills form → Client-side validation (HTML5 native)
  → POST to https://formspree.io/f/{FORM_ID}
  → Formspree sends email to Jon
  → Client shows success/error message
```

### GitHub repos fetch (build time only)

```
next build triggers getStaticProps / data fetch
  → GET https://api.github.com/users/{username}/repos
  → Filter/sort repos
  → Embed in static HTML
  → If API fails → build continues, repos section omitted
```

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router) | Static export support, file-based routing, React ecosystem |
| Styling | CSS Modules + CSS custom properties | Design tokens from DESIGN.md, scoped styles, no runtime CSS-in-JS |
| Content | Markdown + JSON files in repo | Version controlled, no CMS dependency, simple editing |
| Markdown | gray-matter + remark/rehype | Standard pipeline, plugin ecosystem for syntax highlighting |
| Fonts | Instrument Serif, General Sans, JetBrains Mono | Editorial typography per DESIGN.md |
| Contact | Formspree | No server needed, works with static export |
| Deployment | GitHub Pages + GitHub Actions | Free hosting, CI/CD on push to main, custom domain support |
| Testing | Vitest + Playwright | Unit tests for data processing, integration tests for pages |

## Key Design Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Static export (no SSR/ISR) | GitHub Pages serves static files only. No server means no server costs, no cold starts, no downtime. | Vercel (supports SSR but adds a provider dependency) |
| Markdown in repo (no CMS) | Content is version-controlled alongside code. No external service to maintain. Jon edits in his IDE. | Contentful, Sanity (adds complexity, API dependency, cost) |
| CSS Modules over Tailwind | Design tokens from DESIGN.md map naturally to CSS custom properties. CSS Modules keep styles scoped without a utility framework. | Tailwind (faster prototyping but fights DESIGN.md token system), styled-components (runtime CSS-in-JS, bad for static sites) |
| Formspree over custom API | No server to maintain. Works with static export. Free tier covers personal site volume. | EmailJS (similar), custom API route (can't use with static export) |
| GitHub API at build time | Repos update on each build, not on every page load. No client-side API calls, no rate limiting concerns for visitors. | Client-side fetch (rate limiting, loading states, slower UX) |
| App Router over Pages Router | App Router is the current Next.js standard. Layout system maps well to shared nav/footer. | Pages Router (stable but legacy direction) |
