# Architecture

The first version is a static client-side React application written in TypeScript. GitHub Pages serves the build; the browser renders the interface. There is no server, account system, remote API, or cloud database.

- app/: application composition, route definitions, and shared page layout.
- features/: user-facing areas and their page-specific logic.
- shared/: reusable UI and app-wide configuration.
- styles/: global design foundations.
- public/: static assets, manifest, and service worker.

Keep route/layout concerns out of feature logic. Keep configuration such as the exam target date in one central location. Avoid abstractions until a real second use case exists. When persistence is added, define a small domain-facing interface first; feature components should not call a storage SDK directly.