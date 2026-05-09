---
title: "Building Tools That Work"
date: "2026-04-15"
excerpt: "What I've learned about building reliable software that people actually want to use."
featured: true
---

There's a difference between building something that works and building something that _works_. The first kind passes tests and ships on time. The second kind disappears into someone's workflow so completely they forget it's there.

## Start with the problem

Every good tool starts with a clear understanding of the problem it solves. Not the problem you wish existed, or the problem that would be fun to solve, but the actual friction someone faces in their day.

```typescript
// Bad: building for the abstract
interface UniversalDataProcessor<T extends Record<string, unknown>> {
  process(data: T): Promise<ProcessedResult<T>>;
  validate(schema: Schema<T>): ValidationResult;
}

// Good: building for the specific
function parseCSVUpload(file: File): Promise<Contact[]> {
  // Handle the actual thing users do
}
```

## Make the common case easy

The best tools make the 80% case trivial and the 20% case possible. This means having strong opinions about defaults while keeping escape hatches available.

## Ship, then listen

You can't design a good tool in isolation. Ship something small, watch how people use it, and iterate. The feedback loop is the feature.
