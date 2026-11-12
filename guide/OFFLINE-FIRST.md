# Offline behaviour

The app is designed to become usable offline after its first successful online load. The service worker is registered only in production, pre-caches the app entry point, manifest, and icon, and caches same-origin scripts, styles, fonts, and images as requested. Hash routing keeps navigation on the same document.

The first visit still requires a network connection. Google Fonts are external and are not guaranteed offline; system fallbacks apply. No user content or study data is persisted yet. When assets change, increment CACHE in public/sw.js. Test offline mode after a production build and successful online visit.