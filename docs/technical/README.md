# Technical
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
Index into technical documentation — architecture, API specs, and configuration reference.

## Owns:
- Pointer to `architecture/` and `api/` subfolders.
- The ADR-tier explanation (below).

## Does not own:
- The ADRs themselves — see `architecture/decisions/`.
- Single-repo implementation decisions — those live in that repo's own `docs/decisions/`.

## Related documentation:
- [architecture/responsibilities.md](architecture/responsibilities.md)
- [architecture/encryption-model.md](architecture/encryption-model.md)
- [architecture/sync-protocol.md](architecture/sync-protocol.md)
- [api/endpoints.md](api/endpoints.md)
- [api/schemas.md](api/schemas.md)
- [api/database.md](api/database.md)
- [api/configuration.md](api/configuration.md)
- [api/events.md](api/events.md)
- `architecture/decisions/` — cross-repo ADRs

### Content
Architecture, API specs, and configuration reference. ADRs have exactly two tiers: each code repo's own `docs/decisions/` for decisions specific to that repo's implementation, and this repo's shared `architecture/decisions/` for anything cross-repo — protocol- or scope-level calls all three clients need to agree on.