---
title: "Context Window Management: Keeping AI Agents Coherent Over Long Tasks"
date: "2026-03-18"
excerpt: "How I handle the fundamental constraint of AI coding agents — the context window fills up, and the agent forgets what it was doing."
---

The hardest problem in building AI coding agents isn't prompting or tool use. It's context management. Your agent starts a complex task, fills its context window reading files and processing results, and then loses track of what it was doing. It re-reads files it already read. It forgets decisions it made three turns ago. It loops.

In [Anvil](https://github.com/jon-kloss/anvil), I've built several systems to manage this constraint. None of them are perfect, but together they keep the agent coherent across tasks that span 50+ turns.

## The context budget

Every LLM has a fixed context window. Even with Claude's generous context (up to 200K tokens when I started building this, now even larger), it fills up faster than you'd think:

- Reading a single source file: 500-2000 tokens
- A compiler error with stack trace: 200-500 tokens
- Each tool call + response: 100-300 tokens
- The system prompt: 2000-5000 tokens

An agent that reads 20 files, runs tests 3 times, and has a few error/retry cycles can easily consume 50K+ tokens. On a complex refactoring task touching 30 files, you'll hit 150K before you're halfway done.

## Compaction strategy

When context usage exceeds 90% of the window, I trigger compaction:

```rust
fn should_compact(&self) -> bool {
    self.estimated_tokens() > self.max_tokens * 0.9
}

fn compact(&mut self) {
    let system_messages = self.messages.iter()
        .filter(|m| m.role == "system")
        .collect();
    
    let recent_turns = self.messages.iter()
        .rev()
        .take(10)
        .collect();
    
    // Keep system context + recent conversation
    self.messages = [system_messages, recent_turns].concat();
    self.token_estimate = self.max_tokens / 2; // Conservative estimate
}
```

The heuristic is simple: keep all system messages (they define behavior) and the most recent 10 turns (they contain active working state). Everything else is discarded.

This works because the most important context is almost always recent. The file you read 40 turns ago is less relevant than the one you read 3 turns ago.

## What compaction loses

The naive approach has a real cost. After compaction, the agent forgets:

- **Files it already read** — it might re-read them, wasting tokens
- **Decisions it made** — it might make contradictory choices
- **Error patterns it saw** — it might try the same failing approach again

## Git as external memory

The agent's changes persist in git even after compaction. By examining the working tree, it can reconstruct what it's done:

```rust
fn recover_context_after_compaction(&self) -> String {
    let diff = git_diff_from_base();
    let status = git_status();
    
    format!(
        "Context recovery — files modified this session:\n{status}\n\
         Summary of changes so far:\n{diff}"
    )
}
```

This is why Anvil commits frequently during long tasks. Each commit is a checkpoint that survives compaction. The commit messages serve as a breadcrumb trail:

```
anvil: Add type definitions for user module
anvil: Implement handler with validation
anvil: Fix type error in response serialization
```

After compaction, the agent can read these messages and understand the arc of work without re-reading every file.

## Parallel worktrees for isolation

Context pollution is worse in multi-task scenarios. If an agent is working on Task A and Task B concurrently (in parallel worktrees), each task's context shouldn't contaminate the other.

Anvil runs parallel tasks in separate git worktrees:

```rust
struct WorktreePool {
    worktrees: Vec<Worktree>,
    max_concurrent: usize, // Default: 8
}

struct Worktree {
    path: PathBuf,
    branch: String,
    task_id: TaskId,
    // Each worktree gets its own agent with its own context
    agent: AgentContext,
}
```

Each parallel task gets its own context window, its own working directory, and its own conversation history. They can't interfere with each other. When both complete, changes merge back with AST-aware conflict resolution.

## Task-scoped context injection

Instead of loading everything at the start, I inject context just-in-time. Before a task starts, the agent receives only what it needs:

```rust
fn prepare_task_context(task: &Task) -> Vec<Message> {
    let mut context = vec![];
    
    // Only the files this task will modify
    for file in &task.target_files {
        context.push(read_file_summary(file));
    }
    
    // Only the interfaces this task consumes
    for dep in &task.dependencies {
        context.push(read_interface(dep));
    }
    
    // The specific spec/requirement for this task
    context.push(format_task_spec(task));
    
    context
}
```

This keeps initial context usage low — typically under 10K tokens — leaving room for the actual work.

## The cost of forgetting

Even with these systems, long tasks still degrade. By turn 40+, the agent is working from partial memory. It occasionally makes decisions that contradict earlier choices. It sometimes re-reads files it's already modified.

The honest answer is that current context window sizes aren't big enough for truly complex multi-file refactoring without some degradation. The mitigation strategies help — checkpoints, external memory, just-in-time loading — but they're workarounds for a fundamental limitation.

Context windows have grown significantly since I started building Anvil — Claude now supports up to 1M tokens. But the fundamental problem remains: complex tasks generate context faster than window size grows. Larger windows help, but they don't eliminate the need for smart context management. They just move the threshold. The job is still managing the constraint gracefully rather than pretending it doesn't exist.
