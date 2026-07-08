# Database Schema
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
Postgres table and column reference for the CacheIt server.

## Owns:
- Table/column definitions: types, PK/FK, nullable, Kotlin type.

## Does not own:
- DTO wire shapes — see [schemas.md](schemas.md). This is a deliberate exception living in the spec repo rather than `cacheit-server` — kept for cross-referencing traceability between wire type and DB column, not because other repos need it directly (only the server touches Postgres).

## Related documentation:
- [schemas.md](schemas.md)
- [endpoints.md](endpoints.md)
- `../architecture/decisions/` — cross-repo ADRs affecting schema shape

### Content

#### accounts
Last updated: 08/07/2026

| Column | Type | Kotlin Type | PK | FK | Nullable | Notes |
|---|---|---|---|---|---|---|
| user_id | UUID | UUID | PK | — | No | Generated server-side. |
| account_holder | VARCHAR(100) | String | | | No | Display name. |
| username | VARCHAR(100) | String? | | | Yes | Unique. Nullable if registered by email. |
| email | VARCHAR(255) | String? | | | Yes | Unique. Nullable if registered by username. |
| password_hash | TEXT | String | | | No | Argon2id hash. |
| mek_envelope | TEXT | String | | | No | MUK-wrapped MEK, base64. |
| created_at | TIMESTAMPTZ | Instant | | | No | |
| is_single_user | BOOLEAN | Boolean | | | No | True if server running in single-user mode. |

#### device_sessions
Last updated: 08/07/2026

| Column | Type | Kotlin Type | PK | FK | Nullable | Notes |
|---|---|---|---|---|---|---|
| device_id | UUID | UUID | PK | — | No | |
| user_id | UUID | UUID | | accounts | No | CASCADE DELETE. |
| device_name | VARCHAR(100) | String? | | | Yes | Client-reported. |
| refresh_token | TEXT | String | | | No | Hashed. Single-use rotating. |
| last_seen_at | TIMESTAMPTZ | Instant | | | No | Updated on every refresh. |
| created_at | TIMESTAMPTZ | Instant | | | No | |

#### notes
Last updated: 08/07/2026

| Column | Type | Kotlin Type | PK | FK | Nullable | Notes |
|---|---|---|---|---|---|---|
| note_id | UUID | UUID | PK | — | No | |
| user_id | UUID | UUID | | accounts | No | CASCADE DELETE. |
| enc_title | TEXT | String | | | No | AES-256-GCM ciphertext, base64. |
| enc_body | TEXT | String? | | | Yes | Nullable — unbound length. |
| enc_drawing | TEXT | String? | | | Yes | MVP proof-of-concept (Android). Encrypted JSON stroke array. |
| locked_by_device_id | UUID | UUID? | | device_sessions | Yes | Set while a device holds the drawing edit lock. |
| locked_at | TIMESTAMPTZ | Instant? | | | Yes | |
| is_deleted | BOOLEAN | Boolean | | | No | Soft delete. Default false. |
| last_modified_at | TIMESTAMPTZ | Instant | | | No | Server-stamped on every write. LWW authority. |
| created_at | TIMESTAMPTZ | Instant | | | No | |

#### note_versions
Last updated: 08/07/2026

| Column | Type | Kotlin Type | PK | FK | Nullable | Notes |
|---|---|---|---|---|---|---|
| version_id | UUID | UUID | PK | — | No | |
| note_id | UUID | UUID | | notes | No | CASCADE DELETE. |
| device_id | UUID | UUID? | | device_sessions | Yes | Nullable — device may since be deleted. |
| enc_title | TEXT | String | | | No | Snapshot at version save time. |
| enc_body | TEXT | String? | | | Yes | |
| is_current | BOOLEAN | Boolean | | | No | True for active version. Only one per note. |
| created_at | TIMESTAMPTZ | Instant | | | No | Used for 30-day retention purge. |

#### voice_notes (reserved, v1.1, not MVP)
Last updated: 08/07/2026

Separate table, not an attachment on `notes` — see `schemas.md`'s `VoiceNoteDto`.

| Column | Type | Kotlin Type | PK | FK | Nullable | Notes |
|---|---|---|---|---|---|---|
| voice_note_id | UUID | UUID | PK | — | No | Own identifier space. |
| user_id | UUID | UUID | | accounts | No | CASCADE DELETE. |
| audio_key | VARCHAR(255) | String? | | | Yes | Object storage key, resolved via `BlobStorageService`. Null until upload completes. |
| duration_seconds | INTEGER | Int? | | | Yes | Reported by client at upload; not authoritative. |
| is_deleted | BOOLEAN | Boolean | | | No | Soft delete flag. |
| deleted_at | TIMESTAMPTZ | Instant? | | | Yes | Drives the 7-day hard-delete purge job. |
| created_at | TIMESTAMPTZ | Instant | | | No | |