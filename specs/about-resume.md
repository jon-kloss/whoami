@status(approved)
@depends-on(site-layout)

# Feature: About and Resume Pages

As a visitor
I want to learn about Jon and review his professional experience
So that I can decide whether to work with him or hire him

## Technical Context

- **About page**: `src/app/about/page.tsx`, content hardcoded or loaded from a data file
- **Resume page**: `src/app/resume/page.tsx`, entries loaded from `content/resume.json`
- **PDF download**: Static file at `public/resume.pdf`, linked from resume page
- **Routes**: `/about`, `/resume`

## UI Design

- **About**: Large page heading in Instrument Serif. Bio text at 1.1875rem, comfortable reading width. "Elsewhere" section as a simple key-value list (platform name left, handle/link right in mono).
- **Resume**: Page heading with PDF download button. Experience entries with title + date on one line, company in accent, description in muted text. Skills section with tech tags.
- **Mockup**: `specs/mockups/site-overview.html` (About and Resume page views)

## Background

- Given the site layout is in place
- And resume data exists in `content/resume.json`

## Rule: About page presents Jon's identity

### Scenario: About page renders bio and links

- Given a visitor navigates to `/about`
- When the page loads
- Then a bio paragraph is displayed
- And an "Elsewhere" section shows links to GitHub, LinkedIn, and email

### Scenario: External links open in new tabs

- Given links to GitHub and LinkedIn are displayed
- When a visitor clicks one
- Then it opens in a new tab

## Rule: Resume page shows professional experience

### Scenario: Resume page renders experience entries

- Given resume entries exist in `content/resume.json`
- When a visitor navigates to `/resume`
- Then experience entries display with title, company, dates, and description
- And entries are sorted by date (most recent first)

### Scenario: PDF download is available

- Given a resume PDF exists at `public/resume.pdf`
- When a visitor clicks "Download PDF"
- Then the PDF downloads to their device

### Scenario: Skills section shows tech tags

- Given skills are defined in the resume data
- When the resume page renders
- Then skills appear as tags in a wrapped list

## Rule: Pages are accessible

### Scenario: Semantic heading structure

- Given either page is rendered
- When tested for accessibility
- Then headings follow a logical hierarchy (h1, h2)
- And all links have descriptive text
