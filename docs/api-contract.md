# Little Napoli: REST API Specification & Contract (v1)

Base URL: `https://littlenapoli.at/api/v1` (Production) / `http://localhost:8000/api/v1` (Local)  
Format: JSON (`application/json`, `application/problem+json` for errors)  
Headers Required:
- `Accept: application/json`
- `Accept-Language: de-AT, de;q=0.9, en;q=0.8`

---

## 1. Menu Endpoints

### `GET /menu/categories`
Returns all 7 active menu categories with item counts and display ordering.

#### Response `200 OK`:
```json
{
  "data": [
    {
      "id": 1,
      "slug": "le-pizze-classiche",
      "name_de": "Le Pizze Classiche",
      "name_en": "Classic Pizzas",
      "description_de": "Klassische neapolitanische Pizze mit zertifizierter San Marzano D.O.P. Tomatensauce",
      "description_en": "Classic Neapolitan pizzas with certified San Marzano D.O.P. tomato sauce",
      "sort_order": 1,
      "items_count": 13
    }
  ]
}
```

### `GET /menu/items`
Returns all menu items with category relations and attached Austrian Codex Allergens (A–R). Query parameters supported: `category_id`, `category_slug`, `is_available`.

#### Response `200 OK`:
```json
{
  "data": [
    {
      "id": 1,
      "slug": "marinara",
      "name": "Marinara",
      "category_slug": "le-pizze-classiche",
      "ingredients": "San Marzano Tomatensauce, Oregano, Knoblauch, Basilikum",
      "base_price": 8.50,
      "tax_rate": 10.00,
      "is_available": true,
      "is_alcoholic": false,
      "allergens": [
        {
          "code": "A",
          "name": "Glutenhaltiges Getreide"
        }
      ]
    },
    {
      "id": 2,
      "slug": "regina-margherita",
      "name": "Regina Margherita",
      "category_slug": "le-pizze-classiche",
      "ingredients": "San Marzano Tomatensauce, Fior di Latte aus Sorrento, Basilikum",
      "base_price": 9.90,
      "tax_rate": 10.00,
      "is_available": true,
      "is_alcoholic": false,
      "allergens": [
        {
          "code": "A",
          "name": "Glutenhaltiges Getreide"
        },
        {
          "code": "G",
          "name": "Milch / Laktose"
        }
      ]
    }
  ]
}
```

---

## 2. Order Endpoints

### `POST /orders`
Creates a customer order for takeaway pickup. Enforces Austrian phone validation and returns dual VAT tax calculations.

#### Request Body:
```json
{
  "customer_name": "Maximilian Mustermann",
  "customer_email": "maximilian@example.at",
  "customer_phone": "+436761234567",
  "pickup_time": "2026-09-11T18:30:00+02:00",
  "payment_method": "cash_on_pickup",
  "items": [
    {
      "menu_item_id": 2,
      "quantity": 2
    },
    {
      "menu_item_id": 50,
      "quantity": 2
    }
  ]
}
```

#### Response `201 Created`:
```json
{
  "data": {
    "order_number": "LN-2026-0911-0042",
    "customer_name": "Maximilian Mustermann",
    "status": "pending",
    "pickup_time": "2026-09-11T18:30:00+02:00",
    "payment_method": "cash_on_pickup",
    "financials": {
      "subtotal": 28.80,
      "food_gross": 19.80,
      "food_net": 18.00,
      "food_vat_10": 1.80,
      "drink_gross": 9.00,
      "drink_net": 7.50,
      "drink_vat_20": 1.50,
      "total_vat": 3.30,
      "total_amount": 28.80,
      "currency": "EUR"
    }
  }
}
```

---

## 3. Reservation Endpoints

### `POST /reservations`
Places an instant table booking request utilizing database pessimistic locks (`lockForUpdate()`).

#### Request Body:
```json
{
  "guest_name": "Anna Schmidt",
  "guest_email": "anna.schmidt@example.at",
  "guest_phone": "+43223542733",
  "party_size": 4,
  "reserved_date": "2026-09-15",
  "time_slot": "19:00",
  "special_requests": "Ruhiger Tisch im Innenbereich bitte."
}
```

#### Response `201 Created`:
```json
{
  "data": {
    "reservation_code": "RES-8A4F1E",
    "guest_name": "Anna Schmidt",
    "party_size": 4,
    "reserved_date": "2026-09-15",
    "time_slot": "19:00",
    "table_number": 4,
    "status": "confirmed"
  }
}
```

---

## 4. Health Probe

### `GET /health`
Returns 200 OK if PostgreSQL, Redis, and storage disks are operational.
