# Offline behaviour

GATEPrep is a static client-side application. The service worker is registered in production from `src/main.tsx`.

## What is cached

- The service worker precaches the app shell: `/`, `/index.html`, the web manifest, and app icon.
- Same-origin scripts, styles, fonts and images are cached when requested successfully.
- Hash routing keeps route navigation within the same document.
- A cache version constant in `public/sw.js` controls the cache namespace; increment it when cache lifecycle changes require invalidation.

## What offline means here

After a successful online visit, the app shell and previously requested same-origin assets can support repeat visits while offline. This is not a guarantee that every resource is available offline.

- First visit requires a network connection.
- External Google Fonts are not guaranteed offline; local/system fallback fonts apply.
- No backend or remote API is required for normal local study workflows.
- Study records are stored in browser storage (IndexedDB/localStorage), not in the service-worker cache.
- Browser storage can be cleared or quota-limited. Offline capability is not a substitute for exporting backups.

## Verification checklist

1. Build and serve the production bundle.
2. Visit the app online and open the main routes/features needed offline.
3. Confirm the service worker is active.
4. Disconnect the network and reload.
5. Navigate between hash routes and open previously loaded assets.
6. Reconnect and verify normal update behaviour after a deployment.

The service worker currently uses a simple app-shell plus runtime asset-cache strategy; it is not a sophisticated offline update or background-sync system.
