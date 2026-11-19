# Project structure

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
  icons/gate-prep.svg
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

## Ownership

- `app`: composition, routes and shared shell.
- `features/dashboard`: home workspace links.
- `features/learning/LearningHub.tsx`: questions, PYQs, subjects, attempts, mistakes, statistics, history and backup/restore.
- `features/learning/AssessmentEngine.tsx`: quiz profiles, test-series profiles, sessions, scoring and assessment imports.
- `features/learning/KnowledgeWorkspace.tsx`: notes, abstractions, cheat sheets, attachments and revision history.
- `features/others/OthersPage.tsx`: counseling, application tracking, reminders and eligible courses.
- `shared`: reusable components and app-wide configuration.
- `styles`: global design tokens, themes and responsive component styling.

Feature modules currently own several internal responsibilities. Keep feature boundaries, but extract validation, scoring, selection, archive handling, and persistence into focused feature-local modules as they grow. Promote code to `shared` only when it has a genuine second use case or is truly app-wide.
