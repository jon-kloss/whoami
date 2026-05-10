---
title: "The Bloated Checklist Problem: When More Instructions Make AI Worse"
date: "2026-05-05"
excerpt: "My AI agent was hitting 50-iteration loops on simple tasks. The fix wasn't better prompting — it was less prompting."
---

I had a self-review checklist in my AI agent's prompt. It was thorough, covering 39 items across categories like off-by-one errors, integer overflow, float comparison, string encoding edge cases, DST transitions, and shallow copy gotchas. It was also destroying performance.

## The problem

My agent in [Anvil](https://github.com/jon-kloss/anvil) runs a self-review step after making changes. The idea is sound: before declaring a task complete, verify your own work. The checklist told the agent what to look for.

With 39 items (~1,156 tokens), the agent would finish a simple bug fix, then spend 30+ iterations "reviewing" its work. It would find phantom issues. It would refactor code that worked. It would add error handling for scenarios that couldn't happen. A task that should take 15 iterations was burning 50.

## What was happening

The checklist was essentially a list of things to worry about:

```
- Check for off-by-one errors in loops
- Verify integer overflow on arithmetic
- Check float comparison with epsilon
- Verify string encoding (UTF-8 boundaries)
- Check for DST transitions in time calculations
- Verify deep vs shallow copy semantics
- Check modulo behavior with negative numbers
- ...34 more items
```

The agent would dutifully scan its code against each item, find something that _could_ theoretically be an issue, and "fix" it. A simple array access becomes a bounds-checked operation. A string concatenation gets UTF-8 validation. A straightforward timestamp comparison gets DST handling for time zones the app never uses.

The model wasn't being stupid. It was doing exactly what I asked: checking every item and acting on potential issues. The problem was that I gave it 39 reasons to keep working.

## The diagnosis

I ran benchmarks. Across 200 tasks:

- Items that caught actual bugs in benchmark runs: **6 out of 39**
- Items that triggered false-positive "fixes": **22 out of 39**
- Items that were never relevant: **11 out of 39**

Most of the checklist was protecting against theoretical problems that didn't exist in practice. Float comparison with epsilon? Not relevant when you're writing a CLI tool that doesn't do math. DST transitions? Not relevant when timestamps are UTC throughout.

## The fix

I cut the checklist from 39 items to 6 — keeping only the ones that caught real bugs in benchmarks:

```
- Verify error paths return/propagate (don't silently swallow)
- Check that new code matches existing patterns in the file
- Verify tests actually assert the behavior described
- Check file paths and imports resolve correctly
- Verify async/await consistency (no fire-and-forget)
- Check that changed function signatures update all call sites
```

From ~1,156 tokens to ~200 tokens. From 50-iteration loops to 15-20 iterations.

I also tightened the stop signal from "Fix these errors" to:

```
Fix ONLY these specific errors. Do not refactor, add features, 
or make other changes. Fix the errors and stop.
```

## Why this matters

There's a natural instinct in prompt engineering to be comprehensive. If the model might miss something, add it to the prompt. If there's an edge case, mention it. This instinct is wrong.

Every instruction you give a language model is a potential trigger for action. A 39-item checklist isn't "context" — it's 39 suggestions to do more work. The model will find ways to apply them because that's what you asked it to do.

The right approach:

1. **Validate against reality.** Does each checklist item catch bugs that actually happen in your codebase?
2. **Measure iteration count.** If tasks are taking 2-3x expected iterations, your prompt is probably over-specified.
3. **Trust the model's judgment.** A capable model with 6 focused checks outperforms any model with 39 vague ones.

Less instruction, better results. The most effective prompts tell the model what matters, not everything that could possibly matter.
