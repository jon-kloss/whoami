@status(approved)
@depends-on(system)
@blocks(blog)
@blocks(projects-showcase)
@blocks(about-resume)
@blocks(contact-form)

# Feature: Site Layout and Theming

As a visitor
I want a consistent, well-crafted layout with dark/light theme support
So that I can navigate the site comfortably and the design feels cohesive

## Technical Context

- **Root layout**: `src/app/layout.tsx` with `<Nav>`, `<Footer>`, and `<ThemeProvider>`
- **Design tokens**: CSS custom properties defined in `src/styles/globals.css`, switched via `[data-theme="dark"]`
- **Fonts**: Loaded via `next/font` (Google Fonts for Instrument Serif + JetBrains Mono) and external CSS (Fontshare for General Sans)
- **Theme persistence**: `localStorage` for user preference, `prefers-color-scheme` as default
- **Nav behavior**: Fixed position, hides on scroll down, shows on scroll up, transparent over hero, solid with backdrop blur elsewhere

## UI Design

- **Register**: brand
- **Design direction**: Vertical Flow with editorial typography
- **Mockup**: `specs/mockups/site-overview.html`
- **Typography**: Instrument Serif headings (weight 400, italic for accent words), General Sans body, JetBrains Mono for code/metadata
- **Color**: Forest green OKLCH committed strategy, tokens from DESIGN.md
- **Motion**: Scroll reveals (fade + translate 12px), nav slide transition, hover underline animations

## Background

- Given the Next.js project is initialized with static export
- And design tokens from DESIGN.md are implemented as CSS custom properties

## Rule: Navigation is always accessible

### Scenario: Navigation renders on all pages

- Given a visitor is on any page
- When the page loads
- Then the navigation shows links to Projects, Blog, About, Resume, Contact
- And the site name "Jon Kloss" links to the home page
- And a theme toggle button is visible

### Scenario: Navigation hides on scroll down

- Given a visitor is scrolling down the page
- When they scroll past 120px
- Then the navigation slides up out of view

### Scenario: Navigation shows on scroll up

- Given the navigation is hidden
- When the visitor scrolls up
- Then the navigation slides back into view
- And it has a solid background with backdrop blur

## Rule: Dark and light themes work correctly

### Scenario: Theme follows system preference on first visit

- Given a visitor has never been to the site
- When they visit any page
- Then the theme matches their system color scheme preference

### Scenario: Theme toggle switches between dark and light

- Given a visitor clicks the theme toggle
- Then the page switches to the opposite theme
- And the preference is saved to localStorage
- And subsequent visits use the saved preference

### Scenario: No flash of wrong theme on load

- Given a visitor has a saved theme preference
- When they load any page
- Then the correct theme is applied before first paint (no flash of unstyled content)

## Rule: Footer appears on all pages

### Scenario: Footer renders consistently

- Given a visitor is on any page
- When they scroll to the bottom
- Then the footer shows copyright and links to GitHub, LinkedIn, RSS

## Rule: Layout is responsive

### Scenario: Mobile layout adjustments

- Given a visitor is on a screen narrower than 640px
- When the page renders
- Then the navigation links have reduced spacing
- And the hero heading scales down proportionally
- And the footer stacks vertically
