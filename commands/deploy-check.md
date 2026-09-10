# Command: deploy-check

## Description
Performs pre-flight checks across both Laravel backend and Next.js frontend prior to staging or production deployments.

## Execution Steps
1. Static analysis: `phpstan` on Laravel and `tsc --noEmit` on Next.js.
2. Code style validation: Laravel Pint and ESLint/Prettier.
3. Tests: Executes Pest PHP and Vitest test suites.
4. Database migration check: Verifies zero-downtime safety of pending migrations.
5. Environment check: Validates all required environment variables in `@t3-oss/env-nextjs` and Laravel `.env`.

## CLI Invocation
```bash
./scripts/deploy-check.sh
```
