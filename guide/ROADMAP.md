# Roadmap

This roadmap reflects the current implementation. Priorities are ordered around reliability and maintainability before adding more surface area.

## Implemented

- [x] React + TypeScript + Vite application and GitHub Pages deployment.
- [x] Responsive shell, hash routes, countdown, themes and accent selection.
- [x] Subject/topic map and topic completion tracking.
- [x] Shared MCQ/MSQ/NAT question bank, PYQ metadata, question editing, images, bookmarks and locking.
- [x] Question attempts, mistake classification, history and analytics.
- [x] Notes, abstractions and cheat sheets with attachments and revision snapshots.
- [x] Daily/weekly/monthly/custom quiz profiles and full-screen quiz sessions.
- [x] Imported subject/mixed/full GATE-style tests, scoring, calculator and history.
- [x] Portable versioned archive backup/restore with SHA-256 verification and image assets.
- [x] Question import from JSON and GATEPrep backup archives.
- [x] Counseling profiles, application tracking, reminders and eligible-course shortlist.
- [x] Production service-worker caching foundation.

## Recommended next priorities

1. **Automated tests:** unit tests for validation, selection, scoring, archive parsing, SHA verification, backup/restore and migration.
2. **Domain extraction:** move pure logic out of large React feature components into feature-local modules.
3. **Canonical taxonomy:** remove duplicated subject/topic definitions.
4. **Persistence boundaries:** introduce small repository interfaces and adapters for the current IndexedDB/localStorage stores.
5. **Schema evolution:** define migrations and backward-compatibility fixtures for saved data and archives.
6. **Browser smoke tests:** cover critical create/edit/import/attempt/restore paths, mobile, portrait, zoom and offline reload.
7. **Optional encrypted backup:** evaluate before any multi-device or remote storage work.
8. **Sync only if needed:** define identity, encryption, conflict resolution and deletion semantics before selecting a provider.

## Not implemented

- User accounts or authentication.
- Cloud database, remote sync, or multi-device conflict handling.
- Server-side backup or recovery.
- Comprehensive automated unit/integration/end-to-end test suite.
- Automatic reminders/notifications outside the app.
