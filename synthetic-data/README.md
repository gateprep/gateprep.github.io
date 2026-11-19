# Synthetic QA data generator

Run npm run synthetic:generate to create a deterministic, disposable QA dataset under synthetic-data/. It uses Node.js built-ins only and mirrors the current GATEPrep v3 backup format and test-series ZIP importer. See synthetic-data/README.md and synthetic-data/TESTING-PROMPT.md.

WARNING: restoring the full archive replaces local browser data after confirmation. Export real data first or use a separate browser profile.
