# Project scope
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
This document outlines the scope of the initial release (MVP) of CacheIt. New release versions may or may not have scope documentation, based on GitHub issue scope and limitations.

## Owns:
- MVP feature list and content limits.
- The scope-creep governance rule for future releases.
- Project build order.

## Does not own:
- Per-platform breakdown of who gets what — see [clients.md](clients.md).
- API/schema detail — see `technical/api/`.
- Encryption mechanics — see `technical/architecture/encryption-model.md`.

## Related documentation:
- [clients.md](clients.md)
- `technical/architecture/decisions/` — cross-repo scope calls that changed this doc (e.g. Android-drawing-as-PoC, content-limit resolution)

### Content

#### Features
Last updated: 08/07/2026

The MVP features are as outlined:
- Notes:
  - Text notes — unbound length (title and body). Postgres `TEXT` already supports this; it's purely a client UI question of whether to show a counter.
  - Vectorized drawing mode — Android only, proof-of-concept. Fixed 3000×3000px canvas with pan/zoom (not infinite/virtualized — no viewport culling or stroke virtualization needed since the canvas is a known, bounded coordinate space).
  - Note history
- Sync
  - Realtime sync via WebSockets
  - Delta sync for cold-start note updates
- Cryptography
  - All note content is encrypted client-side
  - Server has minimal information

#### Scope-creep governance rule
Last updated: 08/07/2026

Minor releases may use 2–4 non-bugfix issue resolutions. Major releases have a suggestion of up to 6 major scope issue resolutions — any more than that and they should have their own scope documentation.

#### Project build order
Last updated: 08/07/2026

The order of implementation and buildout is as follows:
1. Server
2. Android client
3. Avalonia client