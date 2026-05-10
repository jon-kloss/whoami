---
title: "Building a Semantic Cache for LLM Responses"
date: "2026-04-28"
excerpt: "How I built a three-stage caching system that serves repeated queries in microseconds instead of waiting seconds for API responses — with git-aware invalidation."
---

LLM API calls are slow and expensive. When your AI agent asks the same kind of question twice — "what does this function do?" or "generate a test for this interface" — you're paying full price for a response you already have. I built a semantic cache for [Anvil](https://github.com/jon-kloss/anvil) that serves repeated queries in 80 microseconds instead of 2-3 seconds.

## The three-stage lookup

Not all cache hits are equal. An exact text match is free. A semantic similarity search requires embedding computation. I structured the cache as a funnel:

**Stage 1 — Exact match (~80 microseconds):** Normalize whitespace and compare the full prompt text. This catches repeated operations like "run tests" or identical code explanations.

**Stage 2 — Prefix match (~15 milliseconds):** Compare the first 60 characters, then verify with embedding similarity. This catches prompts that start the same way but differ in trailing context (like "explain this function: [same function, different surrounding code]").

**Stage 3 — Semantic match (~40 milliseconds):** Full 384-dimensional cosine similarity against all cached entries. This catches rephrased questions about the same topic.

```rust
pub fn lookup(&self, prompt: &str) -> Option<CachedResponse> {
    // Stage 1: exact (fastest)
    if let Some(hit) = self.exact_match(prompt) {
        return Some(hit);
    }
    
    // Stage 2: prefix + embedding verification
    if let Some(hit) = self.prefix_match(prompt) {
        return Some(hit);
    }
    
    // Stage 3: full semantic search
    self.semantic_match(prompt)
}
```

## Embeddings without a server

I didn't want the cache to require an API call of its own. I use the `all-MiniLM-L6-v2` model via ONNX — about 80MB that runs inference in-process with the `ort` crate. At 384 dimensions, it's small enough for fast cosine similarity scans while capturing enough semantic meaning to be useful.

The embedding step adds ~5ms per cache write. Since LLM responses take 2-10 seconds, this is negligible.

## The classifier problem

Not all prompts should match at the same threshold. A code generation prompt needs high precision — returning cached code for a slightly different spec would be wrong. A knowledge question ("what is CORS?") can match more aggressively since the answer is stable.

I built a simple classifier that categorizes prompts:

```rust
fn classify(prompt: &str) -> PromptCategory {
    // Word-boundary matching to avoid "buggy" matching "bug"
    let code_signals = ["implement", "write", "generate", "create", "fix"];
    let knowledge_signals = ["what is", "explain", "how does", "why"];
    
    // Score and classify
    if code_score > knowledge_score { Code } else { Knowledge }
}
```

The base similarity threshold is 0.85, but it adjusts by stage and category:
- **Stage 3 semantic search for knowledge prompts:** threshold drops to 0.82 (more lenient since knowledge answers are stable)
- **Stage 2 prefix matching:** threshold drops to 0.80 (the prefix already provides strong signal)
- **Code prompts at Stage 3:** stays at the full 0.85 (high precision needed)

## Git-aware invalidation

Here's the problem with caching code-related responses: the code changes. If I cached "explain `parse_config()`" yesterday and then refactored the function today, the cached explanation is wrong.

The solution: include the git tree hash in the cache key.

```rust
struct CacheKey {
    prompt_hash: u64,
    git_tree_hash: String,    // HEAD tree hash
    dirty: bool,              // uncommitted changes exist
}
```

When the tree hash changes (new commit), code-related caches invalidate. Knowledge caches survive across commits since they're not code-dependent.

## Quality tiers

I run multiple models in Anvil — Opus for complex tasks, Sonnet for standard work, Haiku for simple operations. A cached response from Opus can serve a Haiku request (higher quality is fine), but not vice versa.

```rust
struct CachedResponse {
    content: String,
    model_tier: ModelTier,  // Opus > Sonnet > Haiku
    timestamp: Instant,
}

fn is_compatible(cached: ModelTier, requested: ModelTier) -> bool {
    cached >= requested  // Opus serves all, Haiku serves only Haiku
}
```

## Eviction

The cache can't grow forever. I use a hybrid eviction strategy:

- **TTL:** 7 days for code responses, 30 days for knowledge
- **Size cap:** LRU eviction when total cache exceeds 500MB
- **Staleness:** Entries not hit in 14 days get evicted regardless of TTL

## Results

On a typical development session with an AI agent:

- **Cache hit rate:** ~35-40% (higher for iterative debugging sessions)
- **Average savings per hit:** 2.8 seconds and ~$0.003
- **Over an 8-hour session:** ~$2-4 saved, ~15 minutes of wait time eliminated

The biggest wins come during iterative debugging where the agent re-examines the same files and asks similar questions about code structure. Those Stage 1 exact matches are essentially free.

## What I'd do differently

The prefix matching (Stage 2) is the weakest link. Prompts that share a 60-character prefix aren't necessarily semantically similar — it's a heuristic that works 80% of the time. If I rebuilt this, I'd skip Stage 2 and invest in faster Stage 3 (approximate nearest neighbor with an index like HNSW instead of brute-force scan).
