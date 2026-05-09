@status(approved)
@depends-on(site-layout)
@blocks(home-page)

# Feature: Blog

As a visitor
I want to read well-formatted blog posts with a clean listing page
So that I can learn from Jon's writing and find posts that interest me

## Technical Context

- **Content source**: Markdown files in `content/posts/` with YAML frontmatter
- **Processing**: `gray-matter` for frontmatter, `remark`/`rehype` pipeline for Markdown to HTML
- **Routes**: `/blog` (listing), `/blog/[slug]` (individual post)
- **Static generation**: All posts rendered at build time via `generateStaticParams`
- **Syntax highlighting**: `rehype-pretty-code` or `shiki` for code blocks
- **Listing sort**: By date descending, drafts excluded from production builds

## UI Design

- **Blog listing**: Stacked editorial layout. Featured post at top with accent border, larger title, full excerpt. Remaining posts in a clean list with date + title + excerpt.
- **Blog post**: Single column, 68ch max-width. Lead paragraph in slightly larger text. Headings in Instrument Serif. Code blocks on surface background with border.
- **Post metadata**: JetBrains Mono, small, muted color. Date and read time.
- **Mockup**: `specs/mockups/site-overview.html` (Blog Post page view)

## Background

- Given blog posts exist as Markdown files in `content/posts/`
- And each post has valid frontmatter (title, date, excerpt)

## Rule: Blog listing shows all published posts

### Scenario: Listing page renders posts by date

- Given 3 published blog posts exist
- When a visitor navigates to `/blog`
- Then all 3 posts appear sorted by date descending
- And each post shows title, date, and excerpt

### Scenario: Featured post gets prominent treatment

- Given a post has `featured: true` in frontmatter
- When the listing page renders
- Then the featured post appears at the top with a larger title and accent border
- And remaining posts appear in a standard list below

### Scenario: Draft posts are excluded

- Given a post has `draft: true` in frontmatter
- When the listing page renders in production
- Then the draft post is not visible

## Rule: Individual posts render correctly

### Scenario: Post page displays formatted content

- Given a visitor navigates to `/blog/[slug]`
- When the post page loads
- Then the title renders in display typography
- And the date and read time appear as metadata
- And the Markdown content is rendered as formatted HTML

### Scenario: Code blocks have syntax highlighting

- Given a post contains a fenced code block with a language identifier
- When the post renders
- Then the code block uses syntax highlighting
- And the code block has a surface background with border

### Scenario: Post page respects line length

- Given a post page is displayed on a wide screen
- When the content renders
- Then the body text does not exceed 68ch width

## Rule: Markdown processing handles edge cases

### Scenario: Post with no code blocks

- Given a post contains only prose and headings
- When the post renders
- Then all content displays correctly without errors

### Scenario: Post with images

- Given a post references a local image
- When the post renders
- Then the image displays with appropriate sizing
