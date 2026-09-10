# Command: seed-menu-laravel

## Description
Executes database migrations and populates the PostgreSQL database with the complete authentic Neapolitan menu for Little Napoli, including all 8 categories, variants, and Austrian Codex Allergens (A–R).

## Execution Steps
1. Runs `php artisan migrate:fresh` on the Laravel backend database.
2. Executes `RolesAndPermissionsSeeder` creating Admin, Kitchen Staff, and Service roles.
3. Populates `AllergensSeeder` with Codex letters A through R.
4. Executes `MenuSeeder` populating all 8 categories:
   - Pizze Classiche (Marinara, Margherita D.O.P., Diavola, etc.)
   - Pizze Gialle (Datterino Giallo specialties)
   - Pizze Bianche
   - Calzoni & Ripieni
   - Pasta Fatta in Casa
   - Insalate & Antipasti
   - Dolci Artigianali
   - Bevande & Birre
5. Clears and warms the Redis cache for menu queries.

## CLI Invocation
```bash
php apps/backend-laravel/artisan db:seed --class=DatabaseSeeder
```
