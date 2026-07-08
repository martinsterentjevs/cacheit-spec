# API Endpoints
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
This document outlines the up-to-date endpoints and schema usages as per the endpoints as the specification outline for CacheIt.

## Owns:
- REST method/path/status/auth table for every endpoint.

## Does not own:
- Field-level DTO shapes — see [schemas.md](schemas.md).

## Related documentation:
- [schemas.md](schemas.md)
- `../architecture/sync-protocol.md` — the flow endpoints participate in
- `../api/events.md` — the WebSocket-side equivalent of this table
- `../architecture/decisions/` — cross-repo ADRs affecting endpoint shape (e.g. voice notes as a separate resource)

### Content

**Annotation convention:** once this spec has an official baseline, a changed rule gets marked inline at the point of change as `**NEW [date]:** X is now Y — see [decision link]`, rather than silently rewritten. This initial version carries no NEW markers since there's no prior baseline to diff against.

## Categories
- [Account](#account-endpoints)
- [Session](#session-endpoints)
- [Note](#note-endpoints)
  - [Locking](#note-locking-endpoints)
  - [Version History](#note-version-endpoints)
  - [Audio Notes](#audio-notes-endpoints) (reserved, out-of-current-scope placement)

### Account Endpoints
Last Updated: 06/07/2026

| Http method | Endpoint URL | Requires auth? | Request Body | Response Body | Normal Status Code | Failed Status Code | Notes |
|---|---|---|---|---|---|---|---|
| DELETE | `/account` | Yes | N/A | N/A | 204 | 403 | Cascade wipe: notes, versions, devices, sessions. Active devices get `ACCOUNT_TERMINATED`. |
| GET | `/account/devices` | Yes | N/A | `DeviceSessionDto[]` | 200 | 403 | List registered devices for current user. |
| DELETE | `/account/devices/{deviceId}` | Yes | N/A | N/A | 204 | 403, 404 | Revoke a specific device session. |

### Session Endpoints
Last Updated: 06/07/2026

Auth-related endpoints. JWT rotation, login/registration are handled here.

| Http method | Endpoint URL | Requires auth? | Request Body | Response Body | Normal Status Code | Failed Status Code | Notes |
|---|---|---|---|---|---|---|---|
| POST | `/auth/register` | No | `RegisterDto` | `AccountSessionDto` | 200 | 400 | Either username or email required. Returns MEK envelope + session. |
| POST | `/auth/login` | No | `LoginDto` | `AccountSessionDto` | 200 | 401 | Either username or email required. Returns MEK envelope + session. |
| POST | `/auth/refresh` | No | `RefreshRequestDto` | `AccountSessionDto` | 200 | 401 | Opaque refresh token. Returns `ACCOUNT_TERMINATED` if account deleted. |
| POST | `/auth/logout` | Yes | N/A | N/A | 204 | 401 | Invalidates current device refresh token. |

### Note Endpoints
Last Updated: 06/07/2026

Main interactive endpoints of the project. Subject to adapt over the course of MVP.

| Http method | Endpoint URL | Requires auth? | Request Body | Response Body | Normal Status Code | Failed Status Code | Notes |
|---|---|---|---|---|---|---|---|
| GET | `/notes` | Yes | N/A | `NoteDto[]` | 200 | 403 | All non-deleted notes for user, ordered by `lastModifiedAt` desc. |
| POST | `/notes` | Yes | `NoteDto` | `NoteDto` | 201 | 400, 403 | Create note. Server assigns `noteId`, `userId` from JWT. |
| PUT | `/notes/{noteId}` | Yes | `NoteDto` | `NoteDto` | 200 | 403, 404, 409 | Update note. Previous version saved to history. 409 if a drawing edit-lock is held by another device. |
| DELETE | `/notes/{noteId}` | Yes | N/A | N/A | 204 | 403, 404 | Soft delete (`isDeleted=true`). Propagates via WS nudge. |
| GET | `/notes/sync` | Yes | `SyncRequestDto` | `SyncResponseDto` | 200 | 403 | Delta sync. Returns notes changed since `lastSyncedAt`. |

#### Note Locking Endpoints
Last Updated: 06/07/2026

Backs the Android drawing proof-of-concept's edit-lock mechanic: one device claims the lock, others render read-only until it's released.

| Http method | Endpoint URL | Requires auth? | Request Body | Response Body | Normal Status Code | Failed Status Code | Notes |
|---|---|---|---|---|---|---|---|
| POST | `/notes/{noteId}/lock` | Yes | N/A | `NoteDto` | 200 | 403, 404, 409 | Claims the edit lock for the requesting device. 409 if already locked by another device. Fires `NOTE_LOCK_ACQUIRED`. |
| DELETE | `/notes/{noteId}/lock` | Yes | N/A | N/A | 204 | 403, 404 | Releases the lock. Called on submit or explicit cancel. Fires `NOTE_LOCK_RELEASED`. |

### Note Version Endpoints
Last Updated: 06/07/2026

Endpoints for note version history. Versions are kept for 30 days.

| Http method | Endpoint URL | Requires auth? | Request Body | Response Body | Normal Status Code | Failed Status Code | Notes |
|---|---|---|---|---|---|---|---|
| GET | `/notes/{noteId}/history` | Yes | N/A | `NoteVersionMeta[]` | 200 | 403, 404 | List version metadata. No ciphertext returned here. |
| GET | `/notes/{noteId}/history/{versionId}` | Yes | N/A | `NoteVersionDto` | 200 | 403, 404 | Fetch specific version ciphertext for client-side decrypt. |
| POST | `/notes/{noteId}/restore/{versionId}` | Yes | N/A | `NoteDto` | 200 | 403, 404 | Restore version. Creates new version entry, fires `NOTE_RESTORED` nudge. |

### Audio Notes Endpoints
Last Updated: 06/07/2026

Reserved — not in current MVP scope, drafted early to give the eventual v1.1 build a starting shape. Voice notes are a separate resource from text/drawing notes rather than an attachment on them, since audio is materially more storage-expensive — it gets its own lifecycle, including a shorter and harder retention policy than the 30-day version history above.

| Http method | Endpoint URL | Requires auth? | Request Body | Response Body | Normal Status Code | Failed Status Code | Notes |
|---|---|---|---|---|---|---|---|
| GET | `/notes/voice` | Yes | N/A | `VoiceNoteDto[]` | 200 | 403 | Fetch all voice notes for the user. |
| GET | `/notes/voice/{voiceNoteId}` | Yes | N/A | `VoiceNoteDto` | 200 | 403, 404 | Fetch a single voice note. |
| POST | `/notes/voice` | Yes | `VoiceNoteDto` | `VoiceNoteDto` | 201 | 400, 403 | Upload a voice note. Server assigns `voiceNoteId`. |
| DELETE | `/notes/voice/{voiceNoteId}` | Yes | N/A | N/A | 204 | 403, 404 | Soft delete. Hard delete, including object storage purge, after 7 days. |

Path param is `{voiceNoteId}`, not `{noteId}` — voice notes have their own identifier space since they're not tied to an existing text/drawing note.