# Development guide

Requirements: Node.js 20.19+ and npm (Node 22 is used in deployment).

Run locally:

    npm install
    npm run dev

Validate and build:

    npm run typecheck
    npm run build
    npm run preview

Keep TypeScript strict. Keep exam configuration in src/shared/config/exam.ts, routes in src/app/router.tsx, and navigation labels in src/shared/config/navigation.ts. Avoid dependencies for small utilities that platform APIs handle cleanly.