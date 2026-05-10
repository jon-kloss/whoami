---
title: "Teaching AI to Self-Correct: A Six-Stage Verification Pipeline"
date: "2026-04-20"
excerpt: "How I built a graduated verification system that catches AI coding mistakes at the cheapest possible stage — from instant syntax checks to multi-reviewer consensus."
---

AI coding agents make mistakes. They write code with syntax errors, type mismatches, failing tests, and subtle logic bugs. The question isn't whether to verify their output — it's how to verify efficiently without burning time and tokens on every change.

I built a six-stage correctness pipeline for [Anvil](https://github.com/jon-kloss/anvil) that catches errors at the cheapest stage possible. A missing semicolon gets caught in 1ms at Stage 0. A logic bug might need Stage 4's independent reviewer. Each stage is more expensive but catches subtler problems.

## The stages

**Stage 0 — Parse (tree-sitter, ~1-10ms):** AST validation. Does the code parse? This catches syntax errors, unclosed brackets, malformed strings — the stuff that would obviously fail compilation. It's essentially free and always runs.

```rust
fn stage_0_parse(file: &Path) -> Result<(), Vec<SyntaxError>> {
    let tree = parser.parse(source, None)?;
    let errors = collect_error_nodes(tree.root_node());
    // Returns positions of ERROR and MISSING nodes
}
```

**Stage 1 — Compile (~1-30s):** Language-aware type checking. Run `cargo check`, `tsc --noEmit`, `python -m py_compile` — whatever the project uses. Catches type errors, import resolution failures, and interface mismatches.

**Stage 2 — Lint (~5-15s):** Clippy, ESLint, Ruff. Style and correctness lints that catch common mistakes like unused variables, unreachable code, or incorrect error handling patterns.

**Stage 3 — Test (~10-60s):** Run only the tests affected by the change. If you modified `auth.rs`, run `auth_test.rs` — not the entire test suite. Catches behavioral regressions.

**Stage 4 — Review (one LLM call, ~5-15s):** The pipeline flags the change for independent review. The agent loop spawns a separate verifier that reads the diff and checks for logic errors, edge cases, and integration issues. This catches the subtle stuff that passes compilation and tests but is still wrong.

**Stage 5 — Consensus (multiple LLM calls, ~15-45s):** For critical changes, multiple reviewers are spawned and must reach majority agreement. This is expensive and only triggers for high-complexity changes (default: 3 reviewers, strict majority required).

## Complexity-tiered execution

Not every change needs all six stages. A one-line typo fix doesn't need consensus review. I classify changes by complexity:

```rust
enum Complexity {
    Quick,     // Stages 0-1 only
    Standard,  // Stages 0-3
    Complex,   // Stages 0-5
}

fn classify_change(diff: &Diff) -> Complexity {
    let lines_changed = diff.additions + diff.deletions;
    let files_touched = diff.files.len();
    let has_interface_change = diff.modifies_public_api();
    
    match (lines_changed, files_touched, has_interface_change) {
        (1..=5, 1, false) => Quick,
        (_, _, true) => Complex,
        _ => Standard,
    }
}
```

## Smart scoping

The pipeline only checks what changed. If the agent modified three functions in one file, Stage 0 re-parses only that file. Stage 3 runs only tests that import from that module. Stage 4's reviewer sees only the diff, not the entire codebase.

This scoping is critical. Without it, the pipeline would take minutes on every change. With it, the common case (small change, no type errors, tests pass) completes in under 5 seconds.

## Auto-fix retry loop

When a stage fails, the pipeline doesn't just report the error — it feeds it back to the agent for automatic correction:

```rust
loop {
    let result = run_pipeline(change);
    match result {
        Ok(_) => break,
        Err(errors) if retries < max_retries => {
            agent.send(format!(
                "Fix ONLY these specific errors. Do not refactor \
                 or make other changes:\n{errors}"
            ));
            retries += 1;
        }
        Err(errors) => return Err(errors),
    }
}
```

The "fix ONLY these specific errors" instruction is critical. Without it, the agent tends to over-correct — refactoring surrounding code, adding unnecessary error handling, or "improving" things that aren't broken. Tight error feedback produces tight fixes.

## What Stage 4 actually catches

The independent reviewer (Stage 4) earns its cost by catching things that pass all mechanical checks:

- **Off-by-one in business logic** that tests don't cover
- **Race conditions** in concurrent code that passes sequential tests
- **Incorrect error propagation** (swallowing errors instead of returning them)
- **Stale variable references** after refactoring (using old value instead of new)
- **Missing edge cases** in conditionals (what happens when the list is empty?)

I track Stage 4's hit rate: about 12% of reviews catch something actionable. That means 88% of the time it's "wasted" — but the 12% catches bugs that would otherwise ship.

## The tree-sitter advantage

Stage 0 is the unsung hero. It's so fast (~1-10ms) that it can run on every single keystroke-equivalent change. Before the agent even finishes writing a function, I can validate syntax incrementally. This means the agent gets instant feedback about parse errors without waiting for the full compiler.

Tree-sitter also gives me structural information for free: I can detect which functions were modified (for scoped testing), whether public interfaces changed (for complexity classification), and whether the change introduces new imports (for dependency validation).

Tree-sitter supports hundreds of languages, but I ship grammars for 14 that cover my common use cases (Rust, TypeScript, Python, Go, Java, C, C++, Ruby, Bash, JSON, TOML, HTML, CSS, and JavaScript). The pipeline works identically across all of them — same syntax validation, same function-level change detection.

## Results

Before the pipeline: agents produced code with errors ~30% of the time, requiring manual intervention.

After: errors that reach the user dropped to ~3%. The pipeline catches and auto-fixes most issues transparently. The agent appears more capable because its mistakes are invisible — caught and corrected before anyone sees them.

Cost per task increased by ~$0.02-0.05 for the verification calls. Time per task increased by ~5-15 seconds for the pipeline stages. Both are negligible compared to the cost of shipping broken code and debugging it later.
