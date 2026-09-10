# Rule 01: Laravel Backend Core & REST API Architecture

## 1. Scope & Applicable Skills
This rule enforces enterprise standards for **Skills 001–010** within `apps/backend-laravel/`.

- **Skill 001:** Service-Repository architecture isolating domain logic.
- **Skill 002:** Form Request validation classes with Austrian phone/postal regex.
- **Skill 003:** Eloquent API Resources for uniform JSON payloads.
- **Skill 004:** Laravel Sanctum token-based authentication and secure sessions.
- **Skill 005:** Role-based access control (RBAC) via Spatie Permissions.
- **Skill 006:** Versioned REST API routing (`/api/v1/*`).
- **Skill 007:** Redis-backed rate-limiting tiers.
- **Skill 008:** Global RFC 7807 compliant exception handling.
- **Skill 009:** Asynchronous queue workers for emails, SMS, and thermal printing.
- **Skill 010:** Event/Listener domain architecture.

---

## 2. Directory & Namespace Structure

```text
apps/backend-laravel/app/
├── Http/
│   ├── Controllers/Api/V1/
│   │   ├── MenuController.php
│   │   ├── OrderController.php
│   │   ├── ReservationController.php
│   │   ├── StripeWebhookController.php
│   │   └── ContactController.php
│   ├── Requests/Api/V1/
│   │   ├── StoreOrderRequest.php
│   │   ├── StoreReservationRequest.php
│   │   └── StoreContactRequest.php
│   └── Resources/Api/V1/
│       ├── MenuItemResource.php
│       ├── CategoryResource.php
│       ├── OrderResource.php
│       └── ReservationResource.php
├── Services/
│   ├── MenuService.php
│   ├── OrderService.php
│   ├── ReservationService.php
│   ├── TaxCalculationService.php
│   └── StripePaymentService.php
├── Repositories/
│   ├── Contracts/
│   │   ├── MenuRepositoryInterface.php
│   │   └── OrderRepositoryInterface.php
│   └── Eloquent/
│       ├── EloquentMenuRepository.php
│       └── EloquentOrderRepository.php
├── Events/
│   ├── OrderPlaced.php
│   └── ReservationConfirmed.php
└── Listeners/
    ├── DispatchOrderNotifications.php
    └── QueueKitchenThermalPrint.php
```

---

## 3. Strict Coding Standards

### A. Fat Services, Skinny Controllers
Controllers MUST only handle HTTP transport concerns: receiving validated requests, invoking the domain Service, and returning API Resources. No direct database queries in controllers.

```php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreOrderRequest;
use App\Http\Resources\Api\V1\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->createOrder($request->validated());

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(201);
    }
}
```

### B. Austrian Phone & Postal Validation
All Form Requests containing customer contact information MUST enforce Austrian geographic standards:

```php
namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'customer_name'  => ['required', 'string', 'max:100'],
            'customer_email' => ['required', 'email:rfc,dns'],
            'customer_phone' => ['required', 'string', 'regex:/^(\+43|0)[1-9][0-9]{3,12}$/'],
            'pickup_time'    => ['required', 'date', 'after:now'],
            'items'          => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'exists:menu_items,id'],
            'items.*.quantity'     => ['required', 'integer', 'min:1', 'max:50'],
            'payment_method' => ['required', 'in:stripe_online,cash_on_pickup'],
        ];
    }
}
```

### C. RFC 7807 Exception Format
All unhandled exceptions or domain failures MUST serialize to standard problem details:

```json
{
  "type": "https://littlenapoli.at/errors/kitchen-closed",
  "title": "Kitchen Closed",
  "status": 422,
  "detail": "Our wood-fired oven is currently closed. Operating hours: Tue-Sun 11:00-22:00.",
  "instance": "/api/v1/orders",
  "trace_id": "req-98f24a1b"
}
```
