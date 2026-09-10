# Rule 05: Eloquent ORM, Database & Data Architecture

## 1. Scope & Applicable Skills
This rule enforces database integrity, performance, and schema standards for **Skills 011–020**.

- **Skill 011:** PostgreSQL relational schema with foreign key cascades and check constraints.
- **Skill 012:** Safe zero-downtime database migration pipelines.
- **Skill 013:** Complete Little Napoli menu seeders covering all 8 menu categories.
- **Skill 014:** Polymorphic relations for pizza crust options, extra toppings, and item variants.
- **Skill 015:** Austrian & EU Codex Allergen mapping (Letters A to R).
- **Skill 016:** Pessimistic locking on table reservation time-slots.
- **Skill 017:** Eager loading to eradicate N+1 queries (`Model::preventLazyLoading`).
- **Skill 018:** Soft-delete implementation on orders, reservations, and customer records.
- **Skill 019:** Composite B-tree indexes on slugs, category IDs, and availability flags.
- **Skill 020:** Automated daily snapshot and point-in-time PostgreSQL backup routines.

---

## 2. EU / Austrian Allergen Codex (A–R) Standard

All recipes and menu items in the database must implement the standard Austrian Allergen designations:

```php
namespace App\Enums;

enum AllergenCodex: string
{
    case A = 'Glutenhaltiges Getreide';
    case B = 'Krebstiere';
    case C = 'Ei';
    case D = 'Fisch';
    case E = 'Erdnuss';
    case F = 'Soja';
    case G = 'Milch oder Laktose';
    case H = 'Schalenfrüchte';
    case L = 'Sellerie';
    case M = 'Senf';
    case N = 'Sesam';
    case O = 'Sulfite';
    case P = 'Lupinen';
    case R = 'Weichtiere';
}
```

---

## 3. Concurrency Protection for Table Bookings (Skill 016)

Prevent double-booking dining tables using database pessimistic locking:

```php
namespace App\Services;

use App\Models\Reservation;
use App\Models\DiningTable;
use Illuminate\Support\Facades\DB;
use App\Exceptions\TableUnavailableException;

class ReservationService
{
    public function reserveTable(array $data): Reservation
    {
        return DB::transaction(function () use ($data) {
            $table = DiningTable::where('capacity', '>=', $data['party_size'])
                ->where('is_active', true)
                ->whereDoesntHave('reservations', function ($query) use ($data) {
                    $query->where('reserved_date', $data['reserved_date'])
                          ->where('time_slot', $data['time_slot'])
                          ->whereIn('status', ['confirmed', 'seated']);
                })
                ->lockForUpdate()
                ->first();

            if (!$table) {
                throw new TableUnavailableException("No table available for party size {$data['party_size']} at {$data['time_slot']}.");
            }

            return Reservation::create([
                'dining_table_id'  => $table->id,
                'reservation_code' => 'RES-' . strtoupper(bin2hex(random_bytes(3))),
                'guest_name'       => $data['guest_name'],
                'guest_email'      => $data['guest_email'],
                'guest_phone'      => $data['guest_phone'],
                'party_size'       => $data['party_size'],
                'reserved_date'    => $data['reserved_date'],
                'time_slot'        => $data['time_slot'],
                'status'           => 'confirmed',
            ]);
        });
    }
}
```
