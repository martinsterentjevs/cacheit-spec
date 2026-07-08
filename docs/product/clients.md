# Clients
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
Per-platform feature matrix for CacheIt's two native clients — what's MVP, what's deferred, and where Android and Avalonia diverge.

## Owns:
- The feature parity matrix across Android and Avalonia.
- Which platform gets which feature at MVP vs. post-v1.

## Does not own:
- Why a feature is scoped the way it is — see [scope.md](scope.md).
- How a feature functions mechanically — see `technical/architecture/sync-protocol.md`.

## Related documentation:
- [scope.md](scope.md)
- `technical/architecture/sync-protocol.md`
- `technical/architecture/decisions/` — cross-repo ADRs affecting client scope (e.g. Android-drawing-as-PoC, Avalonia-pressure-post-v1)

### Content

#### Feature matrix
Last updated: 08/07/2026

No web client exists by design — see `technical/architecture/responsibilities.md` for the zero-trust reasoning.

| Area | Feature | Avalonia Desktop | Android (Compose) | MVP? |
|---|---|---|---|---|
| Auth | Login / Register | Form with username/email toggle | Same | Yes |
| Auth | Key storage option | Toggle: memory-only vs DPAPI persist | Toggle: memory-only vs EncryptedSharedPrefs | Yes |
| Auth | Session management | Device list view, revoke sessions | Same | Yes |
| Notes | Note list | Adaptive card grid | Scrollable list view | Yes |
| Notes | Client-side sort | Last modified, title A-Z, title Z-A | Same | Yes |
| Notes | Create / edit / delete (text) | Inline or modal editor | Full-screen editor, long-press to delete | Yes |
| Notes | Swipe delete | N/A (desktop) | Swipe to side, confirm or undo snackbar | Yes |
| **Drawing** | **Canvas (pencil/marker/brush)** | **Reserved — post-v1, adds pressure support** | **MVP proof-of-concept** — fixed 3000×3000px canvas with pan/zoom, no pressure input | **Android: Yes / Avalonia: No** |
| **Drawing** | **Edit lock UI** | **N/A at MVP** | **MVP** — claim on entering drawing mode, read-only banner when another device holds the lock | **Android: Yes** |
| Sync | Real-time WS | Background connection, nudge → REST pull | Same (foreground only) | Yes |
| Sync | Reconnect sync | Delta sync before resubscribe | Same | Yes |
| Version Hist. | View / restore | History panel, list of versions with device + timestamp | Bottom sheet or nav screen | Yes |
| Settings | Key storage, server URL, account deletion | Yes | Yes | Yes |

#### Why Android gets drawing first
Last updated: 08/07/2026

Android is sequenced before Avalonia in the build order (see [scope.md](scope.md)) specifically because it's the first from-scratch implementation of the full crypto/sync stack and carries the highest risk. Giving it the drawing PoC as well means the riskiest phase absorbs the scope addition, rather than splitting it across both clients at once. Avalonia gets drawing parity plus pressure-sensitive input post-v1 — by then the server and crypto work are already shared, so it's a client-only lift, not a re-derivation.