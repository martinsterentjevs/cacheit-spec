# WebSocket Events
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
WebSocket nudge signal definitions for CacheIt's real-time sync — the structural equivalent of `endpoints.md`, but for the socket.

## Owns:
- Connection details for `/ws/sync`.
- The nudge signal type table (type, fields, trigger, expected client action).

## Does not own:
- The flow these events participate in — see [../architecture/sync-protocol.md](../architecture/sync-protocol.md).
- DTO field shapes — see [schemas.md](schemas.md).

## Related documentation:
- [schemas.md](schemas.md)
- [endpoints.md](endpoints.md)
- [../architecture/sync-protocol.md](../architecture/sync-protocol.md)
- `../architecture/decisions/` — cross-repo ADRs affecting event shape

### Content

#### Connection
Last updated: 08/07/2026

| Property | Value | Notes |
|---|---|---|
| Endpoint | `/ws/sync` | Authenticated WebSocket endpoint. |
| Auth | JWT in header | `Authorization: Bearer <accessToken>` on upgrade. Rejected without a valid JWT. |
| Scope | Per user | All connected devices for a user receive nudges — server fans out to every session for that `userId`. |
| Reconnect | Client-managed | Exponential backoff. Client runs a full delta sync before resubscribing. |
| Heartbeat | Ping/pong, `cacheit.ws.heartbeat-interval` | Server closes after `cacheit.ws.missed-heartbeats` missed beats — see `configuration.md`. |

#### Nudge signal types (WsNudgeDto)
Last updated: 08/07/2026

| Type | noteId | lastModifiedAt | lockedByDeviceId | Triggered by | Client action |
|---|---|---|---|---|---|
| `NOTE_UPDATED` | UUID | Instant | — | `PUT /notes/{id}` | Fetch via `GET /notes/{id}`. |
| `NOTE_DELETED` | UUID | Instant | — | `DELETE /notes/{id}` | Mark deleted locally, remove from UI. |
| `NOTE_RESTORED` | UUID | Instant | — | `POST /notes/{id}/restore/{versionId}` | Fetch via `GET /notes/{id}`. |
| `NOTE_LOCK_ACQUIRED` | UUID | — | UUID | `POST /notes/{id}/lock` | Render read-only if not the lock holder. |
| `NOTE_LOCK_RELEASED` | UUID | — | — | `DELETE /notes/{id}/lock` or submit | Re-enable edit affordance. |

The socket never carries note content — only these signals. A client always pulls full data over REST after a nudge.