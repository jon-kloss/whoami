@status(approved)
@depends-on(site-layout)
@blocks(home-page)

# Feature: Projects Showcase

As a visitor
I want to see Jon's projects with curated highlights and open-source repos
So that I can evaluate his technical skills and explore his work

## Technical Context

- **Curated projects**: Loaded from `content/projects.json` at build time
- **GitHub repos**: Fetched from GitHub REST API at build time (`GET /users/{username}/repos`)
- **Route**: `/projects`
- **Static generation**: All data fetched at build time, no client-side API calls

### Data Structures

Curated project (from `projects.json`):
```json
{
  "title": "Nephs Workshop",
  "description": "AI-powered creative workshop for kids",
  "tags": ["Claude Code", "Phaser.js", "Node.js"],
  "url": "https://example.com",
  "repo": "https://github.com/jon-kloss/nephs",
  "featured": true,
  "order": 1
}
```

GitHub repo (from API, relevant fields):
```json
{
  "name": "wire",
  "full_name": "jon-kloss/wire",
  "description": "HTTP API client for AI agents",
  "html_url": "https://github.com/jon-kloss/wire",
  "stargazers_count": 42
}
```

## UI Design

- **Curated projects**: Stacked list items with title, description, tech tags, and directional arrow on hover. Hover state uses accent-surface background.
- **GitHub repos**: Compact list below curated projects under "Open Source" label. Monospace repo name + short description.
- **Mockup**: `specs/mockups/site-overview.html` (Home page, projects section)

## Background

- Given curated projects are defined in `content/projects.json`
- And the GitHub API is accessible at build time

## Rule: Curated projects display with editorial treatment

### Scenario: Projects page shows curated projects

- Given 3 curated projects exist in `projects.json`
- When a visitor navigates to `/projects`
- Then all 3 projects appear sorted by order field
- And each shows title, description, and tech tags

### Scenario: Project links work

- Given a project has a `url` field
- When a visitor clicks the project
- Then they are taken to the project URL in a new tab

## Rule: GitHub repos supplement curated projects

### Scenario: Open source repos are listed

- Given the GitHub API returns public repos for the user
- When the projects page renders
- Then repos appear in a compact list under "Open Source"
- And each shows the repo name and description

### Scenario: GitHub API failure is handled gracefully

- Given the GitHub API is unavailable at build time
- When `next build` runs
- Then the build succeeds
- And the projects page renders without the GitHub repos section
- And curated projects still display normally

## Rule: Projects page is responsive

### Scenario: Mobile layout

- Given a visitor is on a screen narrower than 640px
- When the projects page renders
- Then project items stack vertically
- And directional arrows are hidden
