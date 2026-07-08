# Encryption Model
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
This document outlines the encryption systems in use for CacheIt — the zero-trust key hierarchy and how note content is protected end-to-end.

## Owns:
- Key hierarchy, algorithms, and what each key wraps.
- Re-auth cadence policy direction.

## Does not own:
- Wire-level DTO field lists — see `../api/schemas.md`.
- Client-vs-server ownership split — see `responsibilities.md`.

## Related documentation:
- [responsibilities.md](responsibilities.md)
- [../api/schemas.md](../api/schemas.md)
- [../api/configuration.md](../api/configuration.md)
- `decisions/` — cross-repo ADRs affecting the key model (e.g. the DMUK → MUK rename, ML-DSA-65 → AES-256-GCM correction)

### Content

#### Keys
Last updated: 08/07/2026

The project uses 2 levels of keys:

| Key | Origin | Algorithm | Usage | Notes |
|---|---|---|---|---|
| MUK — Master Unlock Key | User-generated password | Argon2id, with parameters swapped to derive the separate login password hash | Used to wrap the MEK. | Not device-bound — access is account-based, so the same password on any device derives the same MUK. Must rotate cleanly on password change. |
| MEK — Master Encryption Key | Generated on first registration | AES-256-GCM | Used to encrypt and decrypt note content. | Stored as a MUK-wrapped blob on the server. Exists on-device only while the account is open and logged in. |

**Post-quantum note:** AES-256 is already considered quantum-resistant for symmetric use — Grover's algorithm only halves its effective strength, leaving ~128-bit security, which is still acceptable. There's no asymmetric key exchange in this model that would need a post-quantum swap, so AES-256-GCM stays as-is. (An earlier draft of this doc listed ML-DSA-65 for the MEK — that's a signature scheme, not an encryption algorithm, and doesn't apply here; it was a mix-up with Keyring's unrelated device-attestation use case.)

#### Security points about MEK
Last updated: 08/07/2026

MEK only remains on-device while an account is active. To balance ease of use for saving notes against security, the password check runs on a user-set cadence (`cacheit.reauth.interval` — every run / every day / every other day / every week, see `../api/configuration.md`), alongside any possible session revocation. Self-hosters can set the recommendation level. This is similar to Authy-style periodic re-verification.