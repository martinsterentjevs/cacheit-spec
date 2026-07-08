# Release checklist
Created: 08/07/2026 Last updated: 08/07/2026

## Overview
The concrete steps for cutting and publishing a CacheIt release, once a milestone is ready to tag.

## Owns:
- The actual sequence of steps to cut and publish a release.

## Does not own:
- What's in scope for a release — see [../product/scope.md](../product/scope.md).
- Current progress toward a release — see [../product/mvp-checklist.md](../product/mvp-checklist.md).

## Related documentation:
- [../product/scope.md](../product/scope.md)
- [../product/mvp-checklist.md](../product/mvp-checklist.md)
- `CHANGELOG.md` (per repo)

### Content

#### Steps
Last updated: 08/07/2026

- [ ] All planned scope items for this release are merged to `dev`
- [ ] `CHANGELOG.md`'s `[Unreleased]` section reviewed and finalized under the new version heading, in each affected repo
- [ ] CI passes on `dev` for every affected repo
- [ ] Release branch cut from `dev` (`release/vX_Y`), if the change set needs final QA before merging to `main`
- [ ] Merge to `main` via PR
- [ ] Tag `main` with the version (`vX.Y.0`)
- [ ] Back-merge `main` into `dev`
- [ ] GitHub release notes published, linking the finalized changelog entry