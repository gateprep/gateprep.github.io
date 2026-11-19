# Architecture

## Current system

GATEPrep is a static client-side single-page application built with React 19, TypeScript 5.9, Vite 7, and React Router 7. GitHub Pages serves the built files. There is no application server, account system, remote API, or cloud database.

## Layers

- `src/app/`: app composition, hash router, shared shell, navigation and global UI state.
- `src/features/dashboard/`: home/workspace overview.
- `src/features/learning/`: question bank, PYQs, subjects, mistakes, analytics, history, backup, quizzes, tests, notes, abstractions and cheat sheets.
- `src/features/others/`: admissions counseling, application tracking, reminders and eligible-course shortlist.
- `src/shared/`: reusable UI and central app configuration.
- `src/styles/`: global themes, layout and component styling.
- `public/`: app manifest, icon and service worker.
- `.github/workflows/`: build and GitHub Pages deployment.
- `guide/`: product and engineering documentation.

## Feature ownership

- `LearningHub` owns the question bank, attempts, bookmarks, topic completion, learning activity and learning backup/restore interface.
- `AssessmentEngine` owns quiz/test profiles, active sessions, selection/scoring/timers, imports and run history.
- `KnowledgeWorkspace` owns notes, abstractions, cheat sheets, attachments and revision snapshots.
- `OthersPage` owns institute profiles, applications, reminders and eligible courses.
- `AppShell` owns navigation, theme/accent preferences, route transitions and foreground study-time sampling.
- `DashboardPage` is a navigation surface.

## Persistence map

| Domain | Browser storage |
|---|---|
| Questions, attempts, bookmarks, topic progress and learning events | IndexedDB `gateprep-v2`, object store `data`, key `all` |
| Quiz/test profiles, sessions and histories | localStorage `gateprep-assessments-v1` |
| Knowledge entries, revisions and attachments | localStorage `gateprep-knowledge-v1` |
| Admissions data | localStorage `gateprep-admissions-v1` |
| Theme/accent | `gateprep-theme`, `gateprep-accent` |
| Study-time buckets | `gateprep-study-time-v1` |

The stores are separate today. The backup workflow assembles their data into a single portable archive.

## Automated tests and CI

Vitest runs in jsdom with React Testing Library. Tests cover shared exam/navigation configuration, countdown, app composition and shell, route resolution, dashboard, learning hub, assessment engine, knowledge workspace, admissions workflows, and the generic workspace page. GitHub Actions runs `npm test` and `npm run typecheck` for pull requests and pushes to `main`; production build and Pages deployment run only after checks pass on a main-branch push. No external CI/testing service is involved.

These are component/route smoke tests and selected workflow/persistence checks. Domain edge cases, archive fixtures, full assessment scoring permutations, accessibility, real-device layouts, and offline browser behaviour still need deeper automated or manual coverage.

## Architectural strengths

- Feature and route boundaries are understandable.
- Stable question IDs connect attempts, bookmarks, mistake classification, PYQs and analytics.
- Test-series records are isolated from the normal question bank until submission.
- Archive backups have version metadata, an inventory, byte sizes, SHA-256 checksums and separate image assets.
- Shared exam-date and navigation configuration reduce some forms of duplication.
- Static hosting keeps operational complexity low.

## Current trade-offs and debt

- `LearningHub.tsx` and `AssessmentEngine.tsx` are large modules combining UI, domain rules, persistence and import/export concerns.
- Subject/topic taxonomies are duplicated in more than one feature.
- Feature code accesses IndexedDB/localStorage directly; there is not yet a common repository boundary.
- IndexedDB and localStorage are used side by side. This is practical for the current scale but complicates transactions, migrations and backup consistency.
- Automated verification currently centres on TypeScript/build/deployment. A comprehensive unit and browser test suite is still needed.

## Evolution principles

1. Extract pure domain logic before creating generic abstractions.
2. Keep question IDs and attempt references stable.
3. Centralise the subject/topic taxonomy.
4. Add explicit schema versions and tested migrations before changing persisted records.
5. Introduce small repository interfaces around actual domain operations; keep storage adapters replaceable.
6. Keep remote sync optional. If added, define identity, conflict resolution, deletion semantics, and encryption before implementation.
7. Test archive compatibility and restore before shipping data-model changes.

See [Project Structure](PROJECT-STRUCTURE.md), [Offline First](OFFLINE-FIRST.md), and [Future Integrations](FUTURE-INTEGRATIONS.md).
