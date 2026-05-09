@status(approved)
@depends-on(site-layout)

# Feature: Contact Form

As a visitor
I want to send Jon a message through a contact form
So that I can reach out about projects, collaboration, or opportunities

## Technical Context

- **Route**: `/contact`
- **Form submission**: Formspree (POST to `https://formspree.io/f/{form_id}`)
- **Fields**: name (text, required), email (email, required), message (textarea, required)
- **No server needed**: Formspree handles submission, works with static export
- **Form ID**: Stored as environment variable `NEXT_PUBLIC_FORMSPREE_ID`

## UI Design

- **Layout**: Section label + heading, intro text, then form fields
- **Labels**: Visible above each field (not placeholder-only)
- **Inputs**: Full-width, surface background, border, 2px border-radius. Forest green border on focus.
- **Submit button**: Primary button style (accent background, bg text)
- **Mockup**: `specs/mockups/site-overview.html` (Home page, contact section)

## Background

- Given the contact page is rendered
- And Formspree is configured with a valid form ID

## Rule: Form submits messages via Formspree

### Scenario: Successful form submission

- Given a visitor fills in name, email, and message
- When they click "Send Message"
- Then the form submits to Formspree
- And a success message is displayed
- And the form fields are cleared

### Scenario: Submission error is handled

- Given Formspree returns an error
- When the visitor submits the form
- Then an error message is displayed
- And the form data is preserved (not cleared)

## Rule: Form validates required fields

### Scenario: Empty fields prevent submission

- Given a visitor leaves any required field empty
- When they try to submit
- Then the browser's native validation prevents submission
- And the empty field is highlighted

### Scenario: Invalid email is rejected

- Given a visitor enters an invalid email format
- When they try to submit
- Then the browser's native email validation prevents submission

## Rule: Form is accessible

### Scenario: Labels are associated with inputs

- Given the form is rendered
- When tested for accessibility
- Then each input has an associated visible label
- And labels use the `for` attribute matching the input `id`

### Scenario: Form is keyboard navigable

- Given a visitor is using keyboard navigation
- When they tab through the form
- Then focus moves through name, email, message, and submit in order
- And focus states are visible
