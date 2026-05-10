---
title: "When Your AI Won't Parallelize: Debugging Invisible Model Behaviors"
date: "2026-05-08"
excerpt: "How I discovered that my planning agent was creating fully sequential task chains despite explicit instructions to maximize parallelism — and why switching models fixed it."
featured: true
---

I spent two days debugging why my AI coding agent was running tasks one at a time. The planner had explicit instructions: "maximize parallelism, identify independent tasks, run them concurrently." But every single plan came back as a linear chain — Task A depends on B depends on C depends on D.

The bug wasn't in my code. It was in my model choice.

## The setup

In [Anvil](https://github.com/jon-kloss/anvil), my multi-model AI coding agent, I have a planning phase that analyzes a task and breaks it into subtasks. The planner decides which tasks can run in parallel (independent file changes, separate test suites, unrelated modules) and which genuinely depend on each other.

I was using Haiku for planning because it's fast and cheap. The planner prompt was clear:

```
Analyze dependencies between subtasks. Tasks that modify 
different files with no shared interfaces can run in parallel.
Maximize parallelism — only add depends_on when there is a 
genuine data or ordering dependency.
```

## The symptom

Every plan looked like this:

```json
{
  "tasks": [
    { "id": 1, "name": "Add type definition", "depends_on": [] },
    { "id": 2, "name": "Implement handler", "depends_on": [1] },
    { "id": 3, "name": "Write tests", "depends_on": [2] },
    { "id": 4, "name": "Update exports", "depends_on": [3] }
  ]
}
```

Tasks 1, 3, and 4 were clearly independent. The type definition, tests, and export file don't depend on each other. But Haiku chained them every single time.

## The investigation

I tested the same prompt three times with different task descriptions. Every time: fully sequential. Parallelism of 1.

Then I tried Sonnet with the identical prompt. Immediately:

```json
{
  "tasks": [
    { "id": 1, "name": "Add type definition", "depends_on": [] },
    { "id": 2, "name": "Write tests", "depends_on": [] },
    { "id": 3, "name": "Update exports", "depends_on": [] },
    { "id": 4, "name": "Implement handler", "depends_on": [1] }
  ]
}
```

Three parallel tasks, one genuine dependency. Exactly what I wanted.

## Why this happens

Smaller models tend toward conservative, sequential reasoning. When asked to "plan" something, they pattern-match on how plans typically look in training data — and most plans are sequential lists. The model isn't disobeying the instruction to parallelize; it's failing to reason about independence. Determining that two file changes don't interact requires understanding import graphs, type boundaries, and module interfaces. That's a harder reasoning task than simply ordering things linearly.

## The fix

My first fix was switching the planner from Haiku to Sonnet. Immediate improvement — parallel task chains appeared. But hardcoding a model felt wrong. The real fix was making the planner inherit whatever model the user configured:

```rust
// First attempt: hardcode a more capable model
let planner_model = Model::Sonnet;

// Better: use whatever model the user chose
// The planner has no tools, so the call is cheap regardless of model
let planner_model = agent.current_model();
```

The insight: planning doesn't need a specific model — it needs a model capable of reasoning about task independence. If the user picks Sonnet or Opus, the planner works great. If they pick Haiku for cost reasons, they'll get sequential plans, but at least that's a conscious tradeoff rather than a hidden bug.

## The lesson

Not all prompting problems are prompting problems. Sometimes the model simply can't do what you're asking at that capability tier. The tricky part is that it doesn't fail obviously — it produces valid output that looks reasonable. You only notice the problem when you measure the actual behavior against your intent.

When debugging AI systems, check these in order:

1. **Is the prompt clear?** (It was.)
2. **Is the output format correct?** (It was.)
3. **Is the model capable of the reasoning required?** (It wasn't.)

The cheapest model isn't always the cheapest choice. A $0.01 planning call that produces parallel execution saves dollars in agent compute time downstream.
