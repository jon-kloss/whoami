---
title: "API Contract Testing Without OpenAPI Specs"
date: "2026-03-25"
excerpt: "How Wire detects breaking API changes using YAML request files as implicit contracts — no spec files, no code generation, no schema definitions required."
---

Most API contract testing tools require you to maintain an OpenAPI spec, a GraphQL schema, or some other formal definition of your API's shape. Then they compare your implementation against that definition to find drift.

The problem: nobody maintains their specs. They fall out of date the first week. Now you have a contract testing tool that gives you false confidence because it's checking against a stale definition.

I built a different approach in [Wire](https://github.com/jon-kloss/wire). Your request files _are_ the contract. No separate spec to maintain.

## Request files as contracts

A Wire request file looks like this:

```yaml
# .wire/requests/users/create.wire.yaml
method: POST
url: "{{base_url}}/api/users"
headers:
  Content-Type: application/json
  Authorization: "Bearer {{token}}"
body:
  name: "Test User"
  email: "test@example.com"
  role: "member"
tests:
  - field: status
    equals: 201
  - field: body.id
    is_string: true
  - field: body.name
    equals: "Test User"
  - field: body.role
    equals: "member"
```

This file implicitly defines a contract:
- The endpoint accepts `name`, `email`, `role` in the body
- It returns a 201 with an object containing `id` (string), `name`, and `role`
- It requires Authorization and Content-Type headers

No separate spec file. The request file you use for testing _is_ the documentation.

## Snapshot-based contract baselines

Wire can save a "contract snapshot" — a structural fingerprint of all your endpoints:

```bash
wire breaking --save
```

This produces a `contract-snapshot.json`:

```json
{
  "version": "v1",
  "timestamp": "2026-03-25T10:00:00Z",
  "endpoints": [
    {
      "method": "POST",
      "route": "/api/users",
      "params": [],
      "headers": ["Content-Type", "Authorization"],
      "body_type": "json",
      "response_schema": {
        "id": "string",
        "name": "string",
        "role": "string"
      }
    }
  ]
}
```

## Breaking change detection

When you run `wire breaking`, it compares the current request files against the saved baseline:

```bash
$ wire breaking

BREAKING: Removed endpoint DELETE /api/users/{id}
BREAKING: Removed response field body.role from POST /api/users
WARNING:  New required header X-Request-ID on GET /api/users
INFO:     New endpoint POST /api/users/invite
INFO:     New optional param ?include_deleted on GET /api/users
```

The classification:

| Change | Severity | Why |
|--------|----------|-----|
| Endpoint removed | BREAKING | Clients calling it will get 404 |
| Response field removed | BREAKING | Clients parsing it will break |
| New required parameter/header | WARNING | Existing requests will fail |
| New endpoint | INFO | Additive, no breakage |
| New optional parameter | INFO | Existing requests still work |

## Drift detection: code vs. collection

A separate problem: your Wire collection says the endpoint is `GET /api/users`, but someone added `POST /api/users/bulk` in the codebase without a corresponding request file. Wire can detect this drift:

```bash
$ wire drift

NEW (in code, not in collection):
  POST /api/users/bulk         (found in src/routes/users.ts:47)
  DELETE /api/admin/cache       (found in src/routes/admin.ts:12)

STALE (in collection, not in code):
  PUT /api/users/{id}/avatar   (no matching route found)
```

## Multi-language endpoint scanning

Drift detection works by scanning your source code for route definitions. Wire supports multiple frameworks with regex-based pattern matching:

```rust
// Express pattern
r"(?:app|router|server)\s*\.\s*(get|post|put|patch|delete)\s*\(\s*['\"]([^'\"]+)['\"]"

// FastAPI pattern  
r"@(?:app|router)\.(get|post|put|patch|delete)\s*\(\s*['\"]([^'\"]+)['\"]"

// ASP.NET pattern
r"\[Http(Get|Post|Put|Patch|Delete)\s*\(\s*['\"]([^'\"]+)['\"]\s*\)\]"
```

I chose regex over AST parsing deliberately. AST parsing requires language-specific parsers (babel for JS, tree-sitter grammars for each framework). Regex is imperfect but works across all five supported frameworks with zero dependencies.

The tradeoff: regex can't handle dynamic route registration (`routes.forEach(r => app.get(r.path, r.handler))`). But for the 90% case of declarative route definitions, it works reliably.

## Route normalization

Comparing routes from code against routes from Wire files requires normalization. The same endpoint might appear as:

```
// In Express code:
app.get('/users/:id', handler)

// In Wire file:
url: "{{base_url}}/api/users/{{id}}"

// In another framework:
[HttpGet("users/{id:guid}")]
```

Wire normalizes all of these to `/users/{id}`:

```rust
fn normalize_route(raw: &str) -> String {
    raw
        .replace(r"{{base_url}}", "")      // Strip base URL variable
        .replace(r":(\w+)", "{$1}")        // :id → {id}
        .replace(r"\{(\w+):\w+\}", "{$1}") // {id:guid} → {id}
        .replace(r"\{\{\s*(\w+)\s*\}\}", "{$1}") // {{id}} → {id}
        .to_lowercase()
}
```

## Why this works better than specs

1. **No maintenance burden.** You write request files to test your API. Those files naturally stay up to date because you run them.
2. **Test and document simultaneously.** The same file that tests behavior also documents the contract.
3. **No code generation.** No generating client libraries from specs, no keeping generated code in sync.
4. **Progressive adoption.** Start with one request file. Add more as you go. No need to document the entire API upfront.

The contract isn't a separate artifact you maintain — it emerges from the tests you're already writing.
