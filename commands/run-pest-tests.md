# Command: run-pest-tests

## Description
Executes the automated Pest PHP test suite on `apps/backend-laravel/`, verifying the Austrian VAT fiscal engine, order workflows, table reservation concurrency locks, and API Resources.

## Execution Steps
1. Runs unit tests for Austrian dual-tier tax calculation (10% Food / 20% Beverage UStG).
2. Runs feature tests for order creation, Stripe webhook cryptographic verification, and pickup scheduling.
3. Tests table reservation concurrency protection under simulated simultaneous requests (`lockForUpdate`).
4. Verifies RFC 7807 problem details error responses.

## CLI Invocation
```bash
php apps/backend-laravel/vendor/bin/pest
```
