# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository status
- This repo currently contains only VCS metadata and no application code or tooling files (e.g., no README, package.json, Dockerfile, or test configs).
- Until build/test tooling is added, most language- or framework-specific commands do not apply.

Commands
- Git status and branches (pager disabled):
  - git --no-pager status
  - git --no-pager branch -vv
  - git --no-pager remote -v
- Inspect tree and hidden files:
  - ls -la
  - ls -laR | sed -n '1,200p'  # first 200 lines if the tree grows large

When tooling appears, update this section with exact scripts from the codebase (do not guess). Specifically capture:
- Build: the primary build command and any environment prerequisites.
- Lint/format: the exact linter/formatter and scripts.
- Tests: how to run the full suite and a single test (include the precise CLI incantation).

Architecture overview
- Not applicable yet. No source files are present, so there is no project structure to summarize. When the code is added, describe:
  - Top-level app framework (e.g., Next.js, Vite, Expo) and entry points.
  - State management, data-fetching, routing, and API boundaries.
  - Test strategy (unit/e2e) and where tests live.

Notes for Warp
- If a WARP.md already exists in the future, prefer that as the source of truth and merge improvements here into it.
- If CLAUDE.md, .cursor/rules/, .cursorrules, or .github/copilot-instructions.md are added later, pull their important constraints into this file.
