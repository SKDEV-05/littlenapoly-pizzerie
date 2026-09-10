# Little Napoli: Entity Relationship Diagram & Data Model

This document outlines the relational data model for the Laravel backend and PostgreSQL database.

---

## 1. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    CATEGORIES ||--o{ MENU_ITEMS : contains
    MENU_ITEMS ||--o{ ITEM_VARIANTS : has
    MENU_ITEMS ||--o{ MENU_ITEM_ALLERGENS : has
    ALLERGENS ||--o{ MENU_ITEM_ALLERGENS : categorizes
    MENU_ITEMS ||--o{ ORDER_ITEMS : ordered_as
    ORDERS ||--o{ ORDER_ITEMS : includes
    ORDER_ITEMS ||--o{ ORDER_ITEM_TOPPINGS : customized_with
    EXTRA_TOPPINGS ||--o{ ORDER_ITEM_TOPPINGS : selected
    USERS ||--o{ ORDERS : places
    USERS ||--o{ RESERVATIONS : books
    DINING_TABLES ||--o{ RESERVATIONS : allocated_to

    CATEGORIES {
        bigint id PK
        string slug UK
        string name_de
        string name_en
        int sort_order
        boolean is_active
        timestamp created_at
    }

    MENU_ITEMS {
        bigint id PK
        bigint category_id FK
        string slug UK
        string name_de
        string name_en
        decimal base_price
        decimal tax_rate "10.00 or 20.00"
        boolean is_available
        boolean is_vegetarian
        boolean is_spicy
        string model_3d_key
    }

    ALLERGENS {
        string code PK "A to R"
        string name_de
        string name_en
        string description
    }

    MENU_ITEM_ALLERGENS {
        bigint menu_item_id PK,FK
        string allergen_code PK,FK
    }

    DINING_TABLES {
        bigint id PK
        int table_number UK
        int capacity
        boolean is_indoor
        boolean is_active
    }

    RESERVATIONS {
        bigint id PK
        bigint dining_table_id FK
        string reservation_code UK
        string guest_name
        string guest_email
        string guest_phone
        int party_size
        date reserved_date
        time time_slot
        string status "confirmed, seated, cancelled"
        timestamp created_at
    }

    ORDERS {
        bigint id PK
        string order_number UK
        string customer_name
        string customer_email
        string customer_phone
        datetime pickup_time
        string order_status "pending, in_prep, ready, completed"
        string payment_status "unpaid, paid, refunded"
        string payment_method "stripe_online, cash_on_pickup"
        decimal subtotal_amount
        decimal tax_food_10
        decimal tax_drink_20
        decimal total_amount
        timestamp created_at
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint menu_item_id FK
        bigint variant_id FK
        int quantity
        decimal unit_price
        decimal line_total
    }
```

---

## 2. Table Indexing & Performance Strategies

1. **`menu_items`**: Composite index on `(category_id, is_available)` to serve menu requests in sub-5ms.
2. **`reservations`**: Composite index on `(reserved_date, time_slot, status)` to rapidly evaluate table capacity.
3. **`orders`**: Indexes on `(order_status, created_at)` and `(order_number)` for fast POS and kitchen dispatch queries.
