# 0001-Session Endpoint Clarification

Status: Accepted
Date:09/07/2026

## Context
Specification repo `docs/technical/api/endpoints.md` had a misleading note on refreshing tokens of a deleted account

## Decision
The relevant file gets updated to reflect the intented state: `ACCOUNT_TERMINATED` gets reserved as a WebSocket nudge call. The response status code `401` is to be returned without clarifying if the account is removed or token is just incorrect.

## Consequences
Specification no longer shows two opposing concepts of `CASCADE DELETE` and still needing a reference to return a `ACCOUNT_TERMINATED`. 

## Alternatives considered
Keeping a reference entry for an account to keep a record to compare refresh tokens to.
