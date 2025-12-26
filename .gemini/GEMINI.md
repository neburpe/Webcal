# Project Constitution (The Fellow's Code)

## 1. Core Mandates
- **Quality over Speed:** We build for the next 5 years, not the next 5 minutes.
- **Zero-Trust:** Verify every import, every script, and every secret.
- **Test-Driven:** No feature is done without a test.

## 2. Technology Standards
- **Language:** TypeScript (Strict mode enabled).
- **Framework:** Next.js (App Router preferred).
- **Styling:** Tailwind CSS. Use `clsx` or `tailwind-merge` for class manipulation.
- **Linting:** Biome or ESLint + Prettier.

## 3. Workflow
- **Conductor:** Updates to architecture go through `conductor/`.
- **Docs:** Keep `product.md` and `docs/adr/` updated.
- **Secrets:** NEVER commit `.env` files.

## 4. Agent Protocols
- **Jules:** Handles bulk refactoring and test generation.
- **Conductor:** Manage high-level planning.
