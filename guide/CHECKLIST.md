# Engineering and release checklist

## Before changing data models
- [ ] Preserve stable question IDs and attempt references.
- [ ] Identify every consumer of the affected record shape.
- [ ] Add or update schema versioning and migration logic.
- [ ] Keep older backup archives readable where intended.
- [ ] Add fixtures for valid, invalid, and legacy import data.
- [ ] Verify duplicate handling and image/attachment references.
- [ ] Confirm backup inventory counts and restore previews remain accurate.

## Before merging
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Review the full diff for unintended scope or data loss.
- [ ] Confirm feature routes and existing workflows remain intact.
- [ ] Confirm responsive behaviour at desktop, portrait, mobile and high browser zoom.
- [ ] Confirm full-screen overlays own their scrolling and do not expose the page beneath.
- [ ] Confirm imports validate before mutating persisted data.
- [ ] Confirm archive imports verify manifest-listed file sizes and SHA-256 hashes.
- [ ] Confirm standalone JSON imports are described accurately (no archive checksum).
- [ ] Confirm backups include all current stores and preserve older-format compatibility where intended.

## After deployment
- [ ] Confirm GitHub Actions build and Deploy steps both succeed.
- [ ] Hard-refresh the live app.
- [ ] Smoke-test the changed workflow on a real browser/device.
- [ ] Test reload persistence for changed records.
- [ ] Test backup and restore using a disposable copy before trusting a new release.
- [ ] Test offline reload after a successful online visit when service-worker behaviour changes.

## Current verification boundary

The GitHub Actions workflow runs TypeScript compilation and a Vite production build, then deploys the `dist` artifact to GitHub Pages. A green workflow confirms that pipeline; it does not prove that every interaction has been browser-tested. Record manual smoke-test results separately.
