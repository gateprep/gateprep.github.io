# Future integrations

GATEPrep currently runs entirely in the browser. It has no backend, account system, cloud database, remote API, or automatic cross-device synchronisation.

## Recommended extension approach

1. Keep domain types and pure rules independent of storage technology.
2. Extract feature-local repositories around actual operations (for example, question lookup, attempt recording, knowledge entry save, archive export).
3. Implement adapters for the current browser stores first; do not introduce a generic provider framework without a real second implementation.
4. Keep migrations explicit and test them against real historical backup fixtures.
5. Treat remote sync as a separate feature requiring identity, encryption, conflict resolution, deletion semantics, offline queueing, and recovery design.
6. Prefer an optional encrypted export/import workflow before introducing a hosted service.

## Current storage adapters (implicit)

- Learning records: IndexedDB.
- Assessment profiles/sessions: localStorage.
- Knowledge records: localStorage.
- Admissions records: localStorage.
- Theme and study-time preferences: localStorage.

These are direct browser-storage integrations rather than a formal repository abstraction. Refactor incrementally when new capabilities require it.

## Avoid

- Speculative provider classes or sync engines.
- Adding authentication just to make the architecture appear future-proof.
- Assuming a cloud adapter can be introduced without data migration and conflict rules.
- Treating browser-local data as encrypted or automatically backed up.
