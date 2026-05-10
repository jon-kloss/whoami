---
title: "Beyond Text Diffs: Building a Structural JSON Comparison Engine"
date: "2026-04-10"
excerpt: "How I built a path-aware JSON diff engine for API regression testing that understands arrays, nested objects, and type changes — not just string differences."
---

Text diffs are useless for JSON. A field moves from line 12 to line 47, and `diff` reports 35 lines changed when semantically nothing changed. I needed something smarter for [Wire](https://github.com/jon-kloss/wire), my API testing tool — a diff engine that understands JSON structure and reports changes as paths like `body.users[0].name: "Alice" → "Bob"`.

## The problem

When you're testing APIs, you save a "golden file" snapshot of the response and compare future responses against it. If something changes, you want to know _what_ changed in terms the developer cares about:

```
Added:   body.metadata.version
Removed: body.users[2]
Changed: body.users[0].email: "old@test.com" → "new@test.com"
```

Not this:

```diff
-  "email": "old@test.com",
+  "email": "new@test.com",
```

The text diff doesn't tell you _which_ user's email changed or where in the object graph you are.

## Recursive tree walk

The core algorithm is a recursive comparison that tracks the current path:

```rust
fn diff_values(old: &Value, new: &Value, path: &str, changes: &mut Vec<Change>) {
    match (old, new) {
        (Value::Object(a), Value::Object(b)) => {
            // Keys in old but not new = removed
            for key in a.keys().filter(|k| !b.contains_key(*k)) {
                changes.push(Change::Removed(format!("{path}.{key}")));
            }
            // Keys in new but not old = added
            for key in b.keys().filter(|k| !a.contains_key(*k)) {
                changes.push(Change::Added(format!("{path}.{key}")));
            }
            // Keys in both = recurse
            for key in a.keys().filter(|k| b.contains_key(*k)) {
                diff_values(&a[key], &b[key], &format!("{path}.{key}"), changes);
            }
        }
        (Value::Array(a), Value::Array(b)) => {
            // Positional comparison
            for i in 0..a.len().max(b.len()) {
                match (a.get(i), b.get(i)) {
                    (Some(av), Some(bv)) => diff_values(av, bv, &format!("{path}[{i}]"), changes),
                    (Some(_), None) => changes.push(Change::Removed(format!("{path}[{i}]"))),
                    (None, Some(_)) => changes.push(Change::Added(format!("{path}[{i}]"))),
                    _ => {}
                }
            }
        }
        _ if old != new => {
            changes.push(Change::Changed(path.to_string(), old.clone(), new.clone()));
        }
        _ => {} // Equal, no change
    }
}
```

## The array problem

Arrays are where it gets interesting. If you have a list of users and one gets inserted at position 0, every subsequent index shifts. A naive positional comparison reports everything as changed:

```json
// Old: ["Alice", "Bob", "Carol"]
// New: ["Zara", "Alice", "Bob", "Carol"]

// Positional diff reports:
// Changed: [0]: "Alice" → "Zara"
// Changed: [1]: "Bob" → "Alice"  
// Changed: [2]: "Carol" → "Bob"
// Added:   [3]: "Carol"
```

This is technically correct but misleading. The real change is "Zara was inserted at [0]."

I chose to keep positional comparison rather than implementing something smarter like matching elements by an ID field or finding the longest common subsequence. Why? Because for API regression testing, positional changes _matter_. If your API changes the order of results, that's a breaking change for clients that depend on ordering. Reporting every shifted index is the conservative, correct behavior.

## Ignore rules for dynamic fields

Real APIs have fields that change on every request — timestamps, request IDs, session tokens. You don't want these reported as diffs. Wire supports ignore rules with wildcard array indices:

```yaml
ignore:
  - body.metadata.timestamp
  - body.users[*].last_login
  - header.x-request-id
```

The wildcard `[*]` matches any array index. So `body.users[*].last_login` ignores the `last_login` field for every user in the array, regardless of position.

The matching algorithm splits on `[*]` and compares segments:

```rust
fn matches_ignore(path: &str, pattern: &str) -> bool {
    let pattern_parts: Vec<&str> = pattern.split("[*]").collect();
    let mut remaining = path;
    
    for (i, part) in pattern_parts.iter().enumerate() {
        if !remaining.starts_with(part) {
            return false;
        }
        remaining = &remaining[part.len()..];
        // Skip past concrete index like [0], [1], [99]
        if i < pattern_parts.len() - 1 {
            if let Some(end) = remaining.find(']') {
                remaining = &remaining[end + 1..];
            } else {
                return false;
            }
        }
    }
    remaining.is_empty()
}
```

## Type changes as first-class events

When a field changes type (object to null, string to number), the diff engine doesn't try to recursively compare incompatible types. It reports a single `Changed` event with both values:

```
Changed: body.config: {"timeout": 30} → null
```

This is more useful than "Removed: body.config.timeout" because it tells you the parent was nulled out — not that individual fields disappeared.

## Canonical serialization for snapshots

When saving snapshots, JSON key order matters for diffability. I serialize with sorted keys and consistent formatting:

```rust
fn canonicalize(value: &Value) -> String {
    serde_json::to_string_pretty(&sort_keys(value)).unwrap()
}
```

This means `{"b": 1, "a": 2}` and `{"a": 2, "b": 1}` produce identical snapshot files. Without this, you'd get phantom diffs from key reordering that the server doesn't control.

## Using it in practice

Wire integrates the diff engine into its test runner:

```bash
# Save a snapshot
wire send auth/login --snapshot

# Later, verify nothing changed
wire test auth/login --snapshot
# Output:
# PASS: auth/login (0 changes, 3 fields ignored)
```

When something does change:

```bash
# FAIL: auth/login (2 changes)
#   Changed: body.token_type: "bearer" → "Bearer"
#   Added:   body.refresh_token
```

The structural path makes it immediately clear what changed and where. No scrolling through text diffs trying to figure out which nested object is different.
