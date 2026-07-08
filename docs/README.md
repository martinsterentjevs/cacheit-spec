# CacheIt Spec — Structure Outline
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
Map of what lives where across `docs/` and what each file is the source of truth for.

## Owns:
- The map of what lives where across `docs/`.

## Does not own:
- Any actual spec content — this is an index, not a doc.

## Related documentation:
- Every file listed below.

Template for every other doc in this tree:

```markdown
> **Owns:** ...
> **Does not own:** ..., see [link] instead
> **Related:** [link], [link]
```

**Writing convention:** CacheIt's docs are self-contained. Any principle that happens to originate from a wider convention gets absorbed and stated directly as CacheIt's own rule — never as a reference or link out to a shared/organizational source. This project isn't currently connected to any such shared repo, and docs shouldn't read as if it were.

---

## design/
| File | Owns | Does not own |
|---|---|---|
| `README.md` | Index into design content. | Nothing external — no shared design repo is currently connected. |

## product/
| File | Owns | Does not own |
|---|---|---|
| `README.md` | Index into product/. | Content itself. |
| `scope.md` | MVP feature list, phase/build order, content limits, scope-creep governance rule. | Per-platform breakdown → `clients.md`. API/schema detail → `technical/api/`. Encryption mechanics → `technical/architecture/encryption-model.md`. |
| `clients.md` | Per-platform feature matrix — what's MVP vs. deferred, Android vs. Avalonia. | Why a feature is scoped that way → `scope.md`. How a feature functions → `sync-protocol.md`. |
|`mvp-checklist.md`| - Current state of the project, per repo, feature by feature. | - Project scope — see [scope.md](scope.md). Design decisions. Release process — see `../process/release-checklist.md`. |


## technical/
| File | Owns | Does not own |
|---|---|---|
| `README.md` | Index into technical/. Explains the 2-tier ADR model. | The ADRs themselves → `architecture/decisions/`. |
| `architecture/decisions/` | Cross-repo ADRs — protocol- or scope-level calls more than one repo must agree on. | Single-repo implementation decisions → that repo's own `docs/decisions/`. |
| `architecture/responsibilities.md` | The client-vs-server ownership boundary. | *How* encryption or sync actually works → `encryption-model.md`, `sync-protocol.md`. |
| `architecture/encryption-model.md` | Key hierarchy, algorithms, field encryption, key storage modes, re-auth cadence. | Wire-level DTO field lists → `api/schemas.md`. |
| `architecture/sync-protocol.md` | Delta sync + WS nudge flow, lock-mechanic sequence diagrams, conflict resolution (LWW). | REST endpoint definitions → `api/endpoints.md`. DTO field shapes → `api/schemas.md`. WS nudge type table → `api/events.md`. |
| `api/endpoints.md` | REST method/path/status/auth table for every endpoint. | Field-level shapes → `api/schemas.md`. |
| `api/schemas.md` | Every wire DTO's field-level shape. | Endpoint behavior → `api/endpoints.md`. DB column detail → `api/database.md`. |
| `api/database.md` | Postgres table/column reference. | DTO wire shapes → `api/schemas.md`. Deliberate exception living here instead of `cacheit-server` — kept for cross-referencing traceability. |
| `api/configuration.md` | Server config key reference. | What each key conceptually affects → `encryption-model.md` / `sync-protocol.md`. |
| `api/events.md` | WebSocket nudge type table. | DTO shapes the nudges reference → `api/schemas.md`. The flow they participate in → `sync-protocol.md`. |

## process/
| File | Owns | Does not own |
|---|---|---|
| `README.md` | Index into process/. | Content itself. |
| `onboarding.md` | New-contributor reading/setup order. | The content of the docs it links to. |
| `release-checklist.md` | Cross-repo MVP progress tracking. | Project scope → `product/scope.md`. |
