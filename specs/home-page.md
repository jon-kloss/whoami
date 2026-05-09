@status(approved)
@depends-on(blog)
@depends-on(projects-showcase)

# Feature: Home Page

As a visitor
I want a compelling landing page that showcases Jon's work and writing
So that I get an immediate sense of who he is and can navigate to what interests me

## Technical Context

- **Route**: `/` (root)
- **Data**: Pulls featured/recent posts from blog data, curated projects from projects data
- **Static generation**: All data resolved at build time
- **Sections**: Hero, Selected Work (projects), Latest Writing (blog), Get in Touch (contact form)
- **Primary CTA**: "Get in Touch" (contact is the primary user action)

## UI Design

- **Hero**: Full viewport height. Large Instrument Serif name (clamp 4.5rem-8rem, weight 400). "Software engineer" tagline below. Primary CTA "Get in Touch" + secondary "View Projects". No scroll hint arrow.
- **Selected Work** (section 01): Curated projects as stacked list items with hover arrows. GitHub repos in compact list below. Default background.
- **Latest Writing** (section 02): Featured post with accent border at top, remaining posts in list below. Surface background for visual variety.
- **Get in Touch** (section 03): Contact form (same as /contact page). Default background.
- **Section labels**: Numbered (01, 02, 03) in monospace accent color above headings. Heading accent words in italic.
- **Scroll reveals**: Sections fade in + translate up 12px on intersection.
- **Mockup**: `specs/mockups/site-overview.html` (Home page view)

## Background

- Given the site layout is in place
- And blog posts and projects data exist

## Rule: Hero section creates a strong first impression

### Scenario: Hero renders with name and CTA

- Given a visitor lands on the home page
- When the page loads
- Then "Jon Kloss" displays in large serif typography
- And "Get in Touch" is the primary CTA button
- And "View Projects" is the secondary CTA

### Scenario: Hero occupies full viewport

- Given the browser viewport is any size
- When the hero renders
- Then it fills the full viewport height

## Rule: Selected Work section shows curated projects

### Scenario: Featured projects appear on home page

- Given curated projects exist with `featured: true`
- When the home page renders
- Then featured projects appear in the "Selected Work" section
- And each project shows title, description, and tech tags

### Scenario: GitHub repos appear below projects

- Given GitHub repos were fetched at build time
- When the home page renders
- Then a compact repo list appears under "Open Source"

## Rule: Latest Writing section shows recent posts

### Scenario: Featured and recent posts appear

- Given blog posts exist, one with `featured: true`
- When the home page renders
- Then the featured post appears with prominent treatment
- And 2-3 recent posts appear in a list below

### Scenario: Writing section has visual contrast

- Given the home page renders
- When the user scrolls to the writing section
- Then it has a different background color (surface) from adjacent sections

## Rule: Contact section provides a direct path to reach out

### Scenario: Contact form on home page

- Given the home page renders
- When the user scrolls to the contact section
- Then a working contact form is displayed
- And it submits via Formspree (same as /contact page)

## Rule: Sections animate on scroll

### Scenario: Scroll reveal animation

- Given a section is below the viewport
- When the visitor scrolls it into view
- Then the section fades in and translates up
- And the animation plays once (not repeated on re-entry)

### Scenario: Reduced motion preference

- Given the visitor has prefers-reduced-motion enabled
- When sections come into view
- Then no transform animation plays
