# GATEPrep

**A local-first, offline-capable study and admissions workspace for GATE CSE preparation.**

Live app: https://gateprep.github.io/  
Repository: https://github.com/gateprep/gateprep.github.io

GATEPrep combines a question bank, PYQ workflow, adaptive practice profiles, GATE-style test sessions, topic-linked knowledge workspaces, performance analytics, portable backups, and postgraduate-admissions tracking in one browser application.

> **Data model at a glance:** the application is client-side only. Study records are stored in the browser on the current device. There is no account system, application server, remote database, or automatic multi-device synchronisation. Export regular backups if the data matters.

---

## Product areas

### 1. Home and study navigation
- Workspace dashboard linking the main study and planning areas.
- Central GATE CSE 2027 countdown, configured in `src/shared/config/exam.ts` (currently 6 February 2027, midnight IST).
- Persistent theme and accent preferences.
- Responsive navigation with horizontal scrolling, trackpad/wheel support, active-tab reveal, and bounded paging controls.

### 2. Subjects and syllabus
- Twelve subject areas aligned to the GATE CSE preparation map:
  Engineering Mathematics, Discrete Mathematics, Digital Logic, Computer Organization & Architecture, C Programming, Programming & Data Structures, Algorithms, Theory of Computation, Compiler Design, Operating Systems, Databases, and Computer Networks.
- Topic-level completion checklist and progress.
- Subject/topic filters connect the syllabus to questions, PYQs, notes, abstractions, and cheat sheets.
- Completion and question records are maintained locally.

### 3. Question bank and PYQs
- Shared question bank with MCQ, MSQ, and NAT question types.
- Text and image prompts; text and image options.
- Subject/topic classification, explanation, marks, negative marks, difficulty, and PYQ year metadata.
- A question can be marked as a regular question or a previous-year question; PYQs remain part of the same underlying bank and are surfaced through the PYQ view.
- Add, edit, search, filter, bookmark, lock/unlock, and attempt questions.
- Locked questions must be explicitly unlocked before editing.
- Question IDs provide the stable link between question records, attempts, bookmarks, analytics, and history.
- Image selection and clipboard-paste workflows include a preview/confirmation step.

### 4. Quizzes
- Built-in Daily, Weekly, and Monthly practice profiles, plus custom profiles.
- Daily practice selects up to 20 questions randomly and retains that day's generated selection.
- Weekly practice prioritises difficult and previously missed questions.
- Monthly practice gives greater weight to repeated mistakes.
- Custom profiles combine whole subjects and individual topics.
- Profile-level attempt history and right/wrong/skipped counts.
- Full-screen quiz attempt workspace, configurable per-question time, question navigation, answer feedback, and saved run history.
- Add questions or import a question bank directly from the Quizzes area. These controls do not replace the PYQ or Test Series workflows.

### 5. Test Series
- Separate imported test profiles, isolated from the regular question bank until submission.
- Subject-wise and mixed tests with 30 questions; full-length tests with 65 questions, 100 marks, and a three-hour duration.
- Validation of question count, subject/topic mapping, question type, option/answer references, NAT numeric answers, marks, and duplicate IDs.
- GATE-style full-screen examination interface with question palette, answer states, mark-for-review, clear response, countdown, submission confirmation, and automatic submission on timeout.
- Built-in calculator.
- MCQ negative marking; MSQ and NAT do not receive negative marking in the scoring model.
- Results and attempt history include score, maximum marks, correct, wrong, unanswered, and elapsed time.
- ZIP test packages can include relative prompt and option image assets.

### 6. Notes, Abstractions, and Cheat Sheets
- Three topic-linked knowledge collections using a shared editor/workspace.
- Create, edit, search, filter, lock/unlock, and delete entries.
- Markdown-style authoring and preview, including headings, lists, block quotes, fenced code, bold text, and highlighted text.
- File/image attachments and clipboard-paste preview.
- Full-screen reader and editor, topic-ordered previous/next navigation, and revision snapshots of saved content.

### 7. Mistake Library
- Mistakes are captured against question-attempt records.
- Classifications include silly, conceptual, understanding, and time-management mistakes.
- Add a note describing the error and the corrected reasoning.
- Browse mistakes by category and connect them back to their source questions and attempt history.

### 8. Statistics and History
- Subject accuracy and proficiency overview, including a 12-axis subject radar.
- Correct/wrong attempt trends, daily and weekly activity, and daily/weekly/monthly study-time views.
- Needs Work breakdown by subject and topic, including repeat-wrong questions.
- Topic Performance includes correct/wrong totals, unique question counts, and sorting by wrong attempts.
- Per-question timestamped attempt history.
- Foreground-visible study-time tracking is an estimate of time the app is visible; it cannot establish that a person is actively studying.
- History clearing is gated by an explicit unlock step.

### 9. Backup and restore
- Portable `.tar.gz` backup with a versioned manifest, schema/reader compatibility metadata, file inventory, byte sizes, SHA-256 checksums, and separately stored image assets.
- Backup payload covers the learning database, quiz/test profiles and run history, active assessment sessions, knowledge entries/revisions/attachments, admissions data, theme/accent preferences, and study-time history.
- Manifest inventory reports counts for questions, PYQs, attempts, quiz/test profiles and runs, knowledge records, attachments/revisions, admissions records, image assets, and tracked study days.
- Restore verifies archive integrity before replacing local data and presents a content summary for confirmation.
- Legacy JSON backup restore remains supported for older formats, with the reduced coverage those formats contain.
- Question-bank import accepts standalone JSON or a GATEPrep backup archive. GATEPrep archive imports verify every manifest-listed file's size and SHA-256 before importing; standalone JSON has no embedded archive checksum and therefore receives structural validation only.
- Imported questions are merged by ID; duplicates are skipped and existing records are preserved. Imported questions are locked by default.

### 10. Admissions and application planning
- Counseling profiles for M.Tech and Ph.D. tracks, including institute pages, separate admissions links, notes, and personal monitoring dates.
- Application tracker with programme, institute, track, status, next date, and notes.
- Reminders with dates and completion state.
- Searchable/sortable eligible-course shortlist with specialization, user-entered GATE cutoff, eligibility criteria, official URL, and notes.
- Per-record lock/unlock controls.
- Monitoring dates are personal check dates, not official deadlines. Cutoffs are user-entered and must be checked against the relevant year/category and official brochure.

---

## Architecture

GATEPrep is a static single-page application built with **React 19, TypeScript 5.9, Vite 7, and React Router 7**. GitHub Pages serves the production bundle. There is no runtime backend.

### High-level layers

| Layer | Location | Responsibility |
|---|---|---|
| App composition | `src/app/` | Router, shared shell, top-level navigation and page composition |
| Feature areas | `src/features/` | Learning, assessment, knowledge, admissions and dashboard workflows |
| Shared configuration/UI | `src/shared/` | Exam date, navigation metadata, countdown and reusable shared components |
| Design system | `src/styles/global.css` | Global tokens, themes, layout, responsive behaviour and component styling |
| Static/PWA assets | `public/` | Web manifest, app icon and service worker |
| Deployment | `.github/workflows/deploy.yml` | TypeScript/Vite build and GitHub Pages deployment |
| Product/engineering docs | `guide/` | Architecture, development, offline behaviour, checklist and roadmap |

### Feature boundaries and data ownership

- **LearningHub** owns the question bank, PYQ metadata, question attempts, bookmarks, topic completion, mistake records, activity events, and the learning backup/restore interface.
- **AssessmentEngine** owns quiz profiles, test-series profiles, active quiz/test sessions, scoring, timers, and assessment run history.
- **KnowledgeWorkspace** owns notes, abstractions, cheat sheets, attachments, and revision snapshots.
- **OthersPage** owns counseling institutes, applications, reminders, and eligible-course records.
- **AppShell** owns global navigation, theme/accent preferences, route transitions, and foreground study-time sampling.
- **DashboardPage** is a navigation/overview surface rather than a second data store.

### Browser persistence

| Data | Current storage |
|---|---|
| Question bank, attempts, bookmarks, topic progress and learning events | IndexedDB database `gateprep-v2`, object store `data`, record key `all` |
| Quiz/test profiles, active sessions and assessment history | localStorage key `gateprep-assessments-v1` |
| Notes, abstractions, cheat sheets, revisions and attachments | localStorage key `gateprep-knowledge-v1` |
| Admissions profiles, applications, reminders and courses | localStorage key `gateprep-admissions-v1` |
| Theme and accent | `gateprep-theme`, `gateprep-accent` |
| Foreground study-time buckets | `gateprep-study-time-v1` |

This is a deliberately simple browser-local persistence model, not yet a unified repository/service architecture. The backup workflow bridges these separate stores into one portable archive.

### Offline and deployment model
- Hash-based routing keeps navigation within the single application document on GitHub Pages.
- The service worker is registered in production. It precaches the app shell and caches same-origin scripts, styles, fonts, and images as they are requested.
- After a successful first online visit, the app shell and previously requested same-origin assets can be available offline.
- First use requires a network connection. External Google Fonts are not guaranteed offline; system font fallbacks are used.
- GitHub Actions runs the production TypeScript/Vite build and deploys the `dist` artifact to GitHub Pages.

---

## Repository map

```text
src/
  app/
    App.tsx
    router.tsx
    layout/AppShell.tsx
  features/
    dashboard/DashboardPage.tsx
    learning/
      LearningHub.tsx
      KnowledgeWorkspace.tsx
      AssessmentEngine.tsx
    others/OthersPage.tsx
    workspace/WorkspacePage.tsx
  shared/
    components/Countdown.tsx
    config/exam.ts
    config/navigation.ts
  styles/global.css
public/
  icons/
  manifest.webmanifest
  sw.js
guide/
  ARCHITECTURE.md
  CHECKLIST.md
  DESIGN-SYSTEM.md
  DEVELOPMENT.md
  FUTURE-INTEGRATIONS.md
  OFFLINE-FIRST.md
  PROJECT-STRUCTURE.md
  ROADMAP.md
.github/workflows/deploy.yml
```

---

## Automated testing

Automated tests run directly in GitHub Actions using GitHub-hosted runners; no separate testing service is required. Vitest and jsdom exercise the app shell, routes, shared configuration, learning and assessment workflows, knowledge editor, admissions trackers, dashboard and workspace pages. Pull requests targeting `main` run tests and TypeScript checks without deploying. Pushes to `main` must pass the same checks before the production build and GitHub Pages deployment proceed.

Run locally with `npm test` (one-shot) or `npm run test:watch` (watch mode). The suite provides component and route smoke tests plus selected persistence/interaction checks; it is a regression baseline, not exhaustive branch coverage or a replacement for real-browser/device testing.

## Local development

Requirements: **Node.js 20.19+** and npm. The deployment workflow currently uses Node.js 22.

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

- `npm run dev`: local Vite development server.
- `npm run typecheck`: TypeScript project checks.
- `npm run build`: TypeScript build followed by Vite production build.
- `npm run preview`: serve the built bundle locally.

See [Development](guide/DEVELOPMENT.md), [Design System](guide/DESIGN-SYSTEM.md), and the rest of [guide/](guide/).

---

## Engineering assessment

### What is strong today
- Clear top-level separation between app composition, feature areas, shared configuration, styling, and deployment.
- Feature workflows are distinct and the question ID is reused to connect attempts, bookmarks, mistake analysis, PYQs, and analytics.
- Local-first operation avoids backend availability, account, and recurring hosting dependencies for personal use.
- Backup is more mature than a simple JSON dump: it has version metadata, inventory, SHA-256 integrity checks, image assets, and compatibility handling.
- Test-series questions are isolated from the normal bank until submission, reducing accidental contamination of study data.
- Strict TypeScript compilation and a repeatable GitHub Actions production build provide a useful baseline quality gate.
- UI work has explicitly addressed mobile, portrait layouts, browser zoom, full-screen editors, independent scrolling, and file-picker focus recovery.

### Where modularity is good — and where it is not
**Good at the feature/route level; only moderate inside the largest features.** The app has meaningful feature boundaries, but `LearningHub.tsx` and `AssessmentEngine.tsx` are large components that contain substantial UI, domain rules, persistence, import/export, and validation logic. `KnowledgeWorkspace.tsx` also owns several concerns in one feature module. This is manageable for a personal application today, but it is not yet a highly decomposed, service-oriented architecture.

### Future-proofing assessment
**Good foundation, not yet enterprise-grade.** Stable question IDs, explicit domain records, versioned backup archives, central route/configuration points, and isolated feature areas create room to evolve. The main constraints are multiple persistence mechanisms, duplicated subject/topic taxonomy in several modules, direct browser-storage access from feature components, and no migration/repository abstraction boundary shared across stores.

### Important limitations
- No backend, login, encryption-at-rest layer, cloud sync, multi-device conflict resolution, or server-side backup.
- Browser storage can be cleared by the user/browser and may be subject to browser quota. The portable backup is therefore important.
- Foreground study-time is a visibility-based estimate, not proof of active study.
- Offline support is an application-shell/cache strategy, not a guarantee that every external resource or first visit works offline.
- Build/deploy success is not a substitute for real-device interaction testing. Verify critical flows in the browser after releases.

### Recommended next engineering steps
1. Add automated unit tests for question validation/scoring, quiz selection, test scoring, archive parsing/checksum verification, and restore compatibility.
2. Extract domain types, validation, scoring, selection, and archive logic from the large React components into feature-local modules.
3. Create one canonical subject/topic taxonomy module and import it wherever needed.
4. Introduce small repository interfaces around real operations, then adapters for IndexedDB/localStorage; avoid a speculative generic data framework.
5. Add explicit schema migrations and backup compatibility tests before changing persisted record shapes.
6. Add browser-level smoke tests for create/edit/import/attempt/restore, portrait widths, mobile safe areas, and offline reload.
7. Consider optional encrypted export before any cloud-sync feature. Treat sync as a separate product decision with conflict semantics, not a quick storage swap.

---

## Current quality snapshot

| Dimension | Assessment | Reason |
|---|---|---|
| Feature breadth | High for a personal GATE workspace | Covers question practice, tests, knowledge, analytics, backup and admissions |
| Feature separation | Good | Distinct route/feature ownership |
| Internal modularity | Moderate | Large feature components still combine multiple responsibilities |
| Data integrity | Good baseline | Stable IDs, validation, archive inventory and SHA-256 checks |
| Persistence architecture | Moderate | Local-first but split across IndexedDB and localStorage |
| Offline readiness | Good for repeat visits | Service-worker shell and same-origin asset caching |
| Extensibility | Good with refactoring | Feature boundaries exist; domain logic should be extracted before major expansion |
| Automated quality assurance | Basic | Strict typecheck/build and deployment workflow; no comprehensive automated test suite documented |
| Multi-device readiness | Low today | No sync, account layer or conflict resolution |
| Production readiness | Suitable as a personal tool with backups and manual smoke tests | Build/deploy is automated; data and UX still need real-device verification |

**Overall:** GATEPrep has grown from a static study-space foundation into a fairly feature-rich personal learning application. Its strongest engineering decisions are the stable question/attempt relationships, isolated assessment workflows, local-first design, and integrity-checked portable backups. The honest caveat is that the feature architecture is more modular than the implementation internals: several large components should be decomposed and tested before adding much more complexity. The next phase should prioritise correctness, test coverage, storage boundaries, and schema evolution rather than adding features for their own sake.
