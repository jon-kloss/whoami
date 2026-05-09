@status(approved)
@system

# System: Jon Kloss Portfolio

A personal developer portfolio and blog that demonstrates engineering skill through its own design and build quality. Six pages: Home, Blog, Projects, About, Resume, Contact. Static export deployed to GitHub Pages with a custom domain.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Next.js 14+ with App Router, static export (`output: 'export'`)
- **Styling**: CSS Modules with CSS custom properties (design tokens from DESIGN.md)
- **Content**: Markdown files in the repo, processed with `gray-matter` + `next-mdx-remote` or `remark`/`rehype`
- **Fonts**: Instrument Serif (Google Fonts), General Sans (Fontshare), JetBrains Mono (Google Fonts)
- **Contact Form**: Formspree (third-party, no server needed)
- **GitHub API**: REST API for public repo data, fetched at build time
- **Deployment**: GitHub Pages via GitHub Actions (build + deploy on push to main)
- **Testing**: Vitest for unit tests, Playwright for integration/visual tests

## Data Model

### Blog Post (Markdown frontmatter)

| Field | Type | Constraints |
|-------|------|-------------|
| title | string | required |
| date | string (ISO 8601) | required |
| excerpt | string | required, max 200 chars |
| tags | string[] | optional |
| featured | boolean | optional, default false |
| draft | boolean | optional, default false |

### Project (data file, JSON or YAML)

| Field | Type | Constraints |
|-------|------|-------------|
| title | string | required |
| description | string | required |
| tags | string[] | required |
| url | string | optional (live link) |
| repo | string | optional (GitHub URL) |
| featured | boolean | optional, default false |
| order | number | sort priority |

### Resume Entry (data file, JSON or YAML)

| Field | Type | Constraints |
|-------|------|-------------|
| title | string | required (job title) |
| company | string | required |
| startDate | string | required |
| endDate | string | optional ("Present" if current) |
| description | string | required |

## Project Structure

```
blog/
  src/
    app/
      layout.tsx          # Root layout with nav, footer, theme provider
      page.tsx            # Home page
      blog/
        page.tsx          # Blog listing
        [slug]/page.tsx   # Individual post
      projects/page.tsx   # Projects listing
      about/page.tsx      # About page
      resume/page.tsx     # Resume page
      contact/page.tsx    # Contact page
    components/
      Nav.tsx             # Navigation with hide-on-scroll
      Footer.tsx          # Site footer
      ThemeToggle.tsx     # Dark/light toggle
      ProjectCard.tsx     # Project list item
      PostCard.tsx        # Blog post list item
      ContactForm.tsx     # Formspree contact form
    lib/
      posts.ts            # Markdown processing utilities
      projects.ts         # Project data loading
      github.ts           # GitHub API client (build-time)
    styles/
      globals.css         # Design tokens, reset, base styles
      *.module.css        # Component-specific styles
  content/
    posts/                # Markdown blog posts
    projects.json         # Curated project data
    resume.json           # Resume entries
  public/
    resume.pdf            # Downloadable resume
  next.config.js          # Static export config
  .github/
    workflows/
      deploy.yml          # GitHub Actions deploy to Pages
```

## Feature Map

| Feature | Spec | Dependencies | Priority |
|---------|------|--------------|----------|
| Site Layout | site-layout.md | system | P0 |
| Blog | blog.md | site-layout | P0 |
| Projects Showcase | projects-showcase.md | site-layout | P1 |
| About & Resume | about-resume.md | site-layout | P1 |
| Contact Form | contact-form.md | site-layout | P1 |
| Home Page | home-page.md | blog, projects-showcase | P1 |

## Non-Functional Requirements

### Scenario: Static export produces valid output

- Given the project is configured with `output: 'export'`
- When `next build` runs
- Then all pages are rendered as static HTML
- And no server-side features are used (no API routes, no server actions)

### Scenario: Performance budget

- Given the site is deployed to GitHub Pages
- When tested with Lighthouse on a 4G connection
- Then the performance score is above 90
- And First Contentful Paint is under 1.5s
- And Cumulative Layout Shift is under 0.1

### Scenario: Accessibility baseline

- Given all pages are rendered
- When tested with axe-core
- Then no WCAG AA violations are found
- And all interactive elements are keyboard-accessible
