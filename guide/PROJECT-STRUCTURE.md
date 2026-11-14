# Project structure

- src/app: root composition, routing, and application layout.
- src/features/dashboard: home page.
- src/features/workspace: initial placeholder pages for each section.
- src/shared/components: reusable UI components.
- src/shared/config: navigation and exam-date configuration.
- src/styles: global styling.
- public: manifest, icon, and offline service worker.
- guide: architecture, workflow, and scope documentation.
- .github/workflows: GitHub Pages deployment.

A feature owns its page-specific components and logic. Move something into shared only when it is genuinely reused or represents app-wide configuration.