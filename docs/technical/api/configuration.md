# Server Configuration Reference
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
Server configuration keys for CacheIt — MVP keys plus the planned object-storage keys for the v1.1 voice notes work.

## Owns:
- Every server config key: type, default, mutability, description.

## Does not own:
- What each key conceptually affects — see [../architecture/encryption-model.md](../architecture/encryption-model.md) and [../architecture/sync-protocol.md](../architecture/sync-protocol.md).

## Related documentation:
- [../architecture/encryption-model.md](../architecture/encryption-model.md)
- [../architecture/sync-protocol.md](../architecture/sync-protocol.md)
- `../architecture/decisions/` — cross-repo ADRs affecting configuration (e.g. object storage backend choice)

### Content

#### MVP configuration
Last updated: 08/07/2026

| Config Key | Type | Default | Mutable? | Description |
|---|---|---|---|---|
| `cacheit.mode` | enum | `multi_user` | No* | `single_user` or `multi_user`. Set on first boot, immutable. *Changing requires DB wipe. |
| `cacheit.single-user.admin-token` | string | (generated) | No | Printed to console on first boot in `single_user` mode. |
| `cacheit.allow-http` | boolean | `false` | Yes | Allow HTTP (non-TLS). LAN/local deploy only. |
| `cacheit.version-retention-days` | integer | `30` | Yes | Days to retain note versions. 0 = unlimited. |
| `cacheit.jwt.access-expiry` | duration | `15m` | Yes | Access token lifetime. |
| `cacheit.jwt.secret` | string | (required) | No | RS256 key path or inline PEM. |
| `cacheit.db.url` / `.username` / `.password` | string | (required) | No | PostgreSQL connection. |
| `cacheit.argon2.time-cost` | integer | `3` | No | Changing breaks existing keys. |
| `cacheit.argon2.memory-kb` | integer | `65536` | No | Changing breaks existing keys. |
| `cacheit.argon2.parallelism` | integer | `4` | No | |
| `cacheit.ws.heartbeat-interval` | duration | `30s` | Yes | WebSocket ping interval. |
| `cacheit.ws.missed-heartbeats` | integer | `2` | Yes | Missed heartbeats before server closes connection. |
| `cacheit.reauth.interval` | enum | `every_run` | Yes | `every_run` / `daily` / `every_other_day` / `weekly`. Self-hoster/user-configurable re-auth cadence — see `../architecture/encryption-model.md`. |

#### Roadmap — object storage (v1.1, not MVP)
Last updated: 08/07/2026

| Config Key | Type | Default | Mutable? | Description |
|---|---|---|---|---|
| `cacheit.storage.backend` | enum | `filesystem` | No* | `filesystem` or `s3`. Set at first boot, immutable. *Changing requires manual blob migration. |
| `cacheit.storage.filesystem.path` | string | `/data/blobs` | Yes | Only used when backend is `filesystem`. |
| `cacheit.storage.s3.endpoint` / `.bucket` / `.access-key` / `.secret-key` | string | (required if `s3`) | No | S3-compatible endpoint — tested against self-hosted Garage; also works with SeaweedFS or real AWS S3. |