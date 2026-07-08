# Schemas
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
This document holds all currently in use schemas and their endpoint usage as specification for CacheIt.

## Owns:
- Every wire DTO's field-level shape (SQL Notation, Kotlin, C#, nullable, origin, encrypted).

## Does not own:
- Endpoint behavior — see [endpoints.md](endpoints.md).
- DB column detail beyond the SQL Notation hint — see `database.md` *(not yet created)*.

## Related documentation:
- [endpoints.md](endpoints.md)
- [`database.md`](database.md)
- `../architecture/decisions/` — cross-repo ADRs affecting a schema (e.g. the MUK rename)

### Content
Missing entries or N/A in SQL Notation are treated as markers of not saving to the database.

**Annotation convention:** once this spec has an official baseline, a changed field gets marked inline at the point of change as `**NEW [date]:** X is now Y — see [decision link]`, rather than silently rewritten. This initial version carries no NEW markers since there's no prior baseline to diff against.

## Schema Categories
Schemas are grouped to match their endpoint usage in [endpoints.md](endpoints.md).
- [Account](#account-schemas)
- [Session](#session-schemas)
- [Note](#note-schemas)
  - [Version History](#note-version-schemas)
  - [Audio Notes](#audio-note-schemas) (reserved, out-of-current-scope placement)

### Account Schemas

#### DeviceSessionDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| deviceId | UUID | UUID | Guid | No | server | No | Primary identifier for the device session. |
| deviceName | VARCHAR(100) | String? | string? | Yes | client | No | Client-reported, e.g. `"Work Laptop"`. |
| lastSeenAt | TIMESTAMPTZ | Instant | DateTimeOffset | No | server | No | Updated on every refresh. |
| isCurrentDevice | BOOLEAN | Boolean | bool | No | server | No | True if this is the requesting device. |

### Session Schemas

Moved here from the original single "Account Schemas" grouping — these four DTOs are all used exclusively by `/auth/*` endpoints, so they're grouped under Session to match [endpoints.md](endpoints.md)'s own categorization.

#### RegisterDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| accountHolder | VARCHAR(100) | String | string | No | client | No | Display name. |
| username | VARCHAR(100) | String? | string? | Yes, if email is provided | client | No | Username or email required. |
| email | VARCHAR(255) | String? | string? | Yes, if username is provided | client | No | Email treated as a regex-validated username. Present purely as a user choice, not used for anything else. |
| password | N/A | String | string | No | client | No | Drives MUK derivation client-side. Never persisted in any form — only its Argon2id hash reaches the server, via a separate field. |

#### LoginDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| username | N/A | String? | string? | Yes, if email is provided | client | No | Username or email required. |
| email | N/A | String? | string? | Yes, if username is provided | client | No | Email treated as a regex-validated username. |
| password | N/A | String | string | No | client | No | Drives MUK derivation client-side. Never persisted. |

#### RefreshRequestDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| deviceId | UUID | UUID | Guid | No | client | No | Device requesting the refresh. |
| refreshToken | TEXT | String | string | No | client | No | Opaque token issued at login. |

#### AccountSessionDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| userId | UUID | UUID | Guid | No | server | No | User identity. |
| deviceId | UUID | UUID | Guid | No | server | No | Issued per device on first login. Included in version history writes. |
| accessToken | N/A | String | string | No | server | No | JWT, short-lived (15 min). Not persisted. |
| refreshToken | TEXT | String | string | No | server | No | Opaque base64, stored hashed. Returned once, never again in plaintext. |
| encMekEnvelope | TEXT | String | string | No | server | No | MUK-encrypted MEK blob. Client decrypts locally with the password-derived key. |

### Note Schemas

#### NoteDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| noteId | UUID | UUID | Guid | No | server | No | Server-assigned on create. |
| userId | UUID | UUID | Guid | No | server | No | Derived from JWT server-side. Never trusted from client. |
| lastModifiedAt | TIMESTAMPTZ | Instant | DateTimeOffset | No | server | No | Server-stamped on every write. LWW authority. |
| isDeleted | BOOLEAN | Boolean | bool | No | server | No | Soft delete flag. |
| encTitle | TEXT | String | string | No | client | Yes | AES-256-GCM ciphertext, base64. |
| encBody | TEXT | String? | string? | Yes | client | Yes | AES-256-GCM ciphertext, base64. |
| encDrawing | TEXT | String? | string? | Yes | client | Yes | MVP proof-of-concept (Android). Encrypted JSON stroke array — pencil/marker/brush, fixed width, no pressure input. |
| lockedByDeviceId | UUID | UUID? | Guid? | Yes | server | No | Set while a device holds the drawing edit lock. |
| lockedAt | TIMESTAMPTZ | Instant? | DateTimeOffset? | Yes | server | No | Cleared on submit or release. |

#### SyncRequestDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| lastSyncedAt | N/A | Instant | DateTimeOffset | No | client | No | Passed as a query param. |
| localNotes | N/A | List\<SyncManifestEntry\> | List\<SyncManifestEntry\> | No | client | No | Array of `{noteId, lastModifiedAt}` — the client's current manifest. |

#### SyncResponseDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| updatedNotes | N/A | List\<NoteDto\> | List\<NoteDto\> | No | server | No | Notes newer than the client's manifest. |
| deletedIds | N/A | List\<UUID\> | List\<Guid\> | No | server | No | Note IDs soft-deleted since `lastSyncedAt`. |
| serverTime | N/A | Instant | DateTimeOffset | No | server | No | Client stores this as the new `lastSyncedAt`. |

### Note Version Schemas

#### NoteVersionMeta
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| versionId | UUID | UUID | Guid | No | server | No | |
| noteId | UUID | UUID | Guid | No | server | No | |
| createdAt | TIMESTAMPTZ | Instant | DateTimeOffset | No | server | No | Used for 30-day retention purge. |
| deviceId | UUID | UUID? | Guid? | Yes | server | No | Device may since be deleted. |
| isCurrent | BOOLEAN | Boolean | bool | No | server | No | True for the active version. |

#### NoteVersionDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| versionId | UUID | UUID | Guid | No | server | No | |
| encTitle | TEXT | String | string | No | server | Yes | Ciphertext snapshot at version save time. |
| encBody | TEXT | String? | string? | Yes | server | Yes | |

### Audio Note Schemas

Reserved — not in current MVP scope. Draft shape only, to give v1.1 a starting point; expect it to firm up once implementation actually starts.

#### VoiceNoteDto
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|
| voiceNoteId | UUID | UUID | Guid | No | server | No | Own identifier space — not tied to a text/drawing note's `noteId`. |
| userId | UUID | UUID | Guid | No | server | No | |
| audioKey | VARCHAR(255) | String? | string? | Yes | server | No | Object storage key, resolved via `BlobStorageService` — not a direct S3 reference. Null until upload completes. |
| durationSeconds | INTEGER | Int? | int? | Yes | client | No | Reported by client at upload time; not authoritative. |
| isDeleted | BOOLEAN | Boolean | bool | No | server | No | Soft delete flag. |
| deletedAt | TIMESTAMPTZ | Instant? | DateTimeOffset? | Yes | server | No | Drives the 7-day hard-delete purge job. |
| createdAt | TIMESTAMPTZ | Instant | DateTimeOffset | No | server | No | |

### Template

#### template
| Parameter | SQL Notation | Kotlin Class | C# Class | Nullable | Origin | Encrypted | Notes |
|---|---|---|---|---|---|---|---|