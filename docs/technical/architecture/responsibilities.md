# Responsibilities
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
This document outlines what responsibilities lie with each part of the project — the client-vs-server ownership boundary.

## Owns:
- The split between what the server owns and what each client owns.
- Which repo is responsible for what, at a project level.

## Does not own:
- *How* encryption actually works — see `encryption-model.md`.
- *How* sync/locking actually works — see `sync-protocol.md`.

## Related documentation:
- [encryption-model.md](encryption-model.md)
- [sync-protocol.md](sync-protocol.md)
- `../../product/scope.md`
- `decisions/` — cross-repo ADRs affecting this boundary

### Content

#### Repo responsibilities
Last updated: 08/07/2026

This project has three other repos: [Server](https://github.com/martinsterentjevs/cacheit-server), [Desktop](https://github.com/martinsterentjevs/cacheit-desktop), [Android](https://github.com/martinsterentjevs/cacheit-android).

Those repositories have their own `docs/decisions/` folders for decision points specific to implementing the [scope defined here](../../product/scope.md).

#### Software responsibilities
Last updated: 08/07/2026

Responsibilities are largely divided into two major parts:
- Server responsibilities
- Client responsibilities

**Server responsibilities** — the server is responsible for:
- Never holding decryption keys or plaintext note content — it stores and relays opaque ciphertext only (see `encryption-model.md`)
- Keeping notes, their historic versions, and deleted notes
- Enforcing last-write-wins by server timestamp — the server is the single authority on `lastModifiedAt` (see `sync-protocol.md`)
- Using WebSockets to enable real-time propagation of note updates
- Locking other devices out of drawing on a note that's already locked by another device
- Deleting notes from user accounts that are deleted

**Client responsibilities** — the client is responsible for:
- Encrypting note content before it ever leaves the device, and decrypting it on receipt — the server never sees plaintext
- Creating, updating, and deleting notes, and passing this to the server
- Preserving note functionality while offline, sending queued changes on reconnection
- Managing account functions