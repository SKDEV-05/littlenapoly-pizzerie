# Little Napoli: Relational Database Schema Design (Prisma / PostgreSQL)

This document specifies the complete entity-relationship model and Prisma schema design for Pizzeria Little Napoli, adhering to Skills 41–50.

---

## 1. Schema Definition (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CUSTOMER
  STAFF
  ADMIN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  IN_PREPARATION
  READY_FOR_PICKUP
  OUT_FOR_DELIVERY
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
  FAILED
}

enum PaymentMethod {
  STRIPE_ONLINE
  CASH_ON_PICKUP
  POS_TERMINAL
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  SEATED
  CANCELLED
  NO_SHOW
}

enum Allergen {
  A // Glutenhaltiges Getreide
  B // Krebstiere
  C // Ei
  D // Fisch
  E // Erdnuss
  F // Soja
  G // Milch oder Laktose
  H // Schalenfrüchte / Nüsse
  L // Sellerie
  M // Senf
  N // Sesam
  O // Sulfite / Schwefeldioxid
  P // Lupinen
  R // Weichtiere
}

model User {
  id            String         @id @default(cuid())
  name          String?
  email         String?        @unique
  phone         String?
  role          Role           @default(CUSTOMER)
  passwordHash  String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  orders        Order[]
  reservations  Reservation[]
  reviews       Review[]
  auditLogs     AuditLog[]

  @@index([email])
}

model Category {
  id          String      @id @default(cuid())
  slug        String      @unique // e.g. "pizze-classiche", "pizze-bianche", "pasta", "dolci"
  nameDe      String
  nameEn      String
  descriptionDe String?
  descriptionEn String?
  sortOrder   Int         @default(0)
  isActive    Boolean     @default(true)
  imageUrl    String?

  items       MenuItem[]

  @@index([slug, isActive])
}

model MenuItem {
  id            String          @id @default(cuid())
  categoryId    String
  slug          String          @unique
  nameDe        String
  nameEn        String
  descriptionDe String
  descriptionEn String
  basePrice     Decimal         @db.Decimal(10, 2)
  taxRate       Decimal         @default(10.00) @db.Decimal(5, 2) // 10% food, 20% beverage (Austrian UStG)
  isAvailable   Boolean         @default(true)
  isSpicy       Boolean         @default(false)
  isVegetarian  Boolean         @default(false)
  isVegan       Boolean         @default(false)
  imageUrl      String?
  model3dKey    String?         // 3D GLB identifier
  allergens     Allergen[]

  category      Category        @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  variants      ItemVariant[]
  orderItems    OrderItem[]
  reviews       Review[]

  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  @@index([categoryId, isAvailable])
  @@index([slug])
}

model ItemVariant {
  id          String      @id @default(cuid())
  menuItemId  String
  nameDe      String      // e.g. "Normal (Ø 33cm)", "Maxi (Ø 45cm)", "0.33l", "0.5l"
  nameEn      String
  priceDelta  Decimal     @default(0.00) @db.Decimal(10, 2)
  isDefault   Boolean     @default(false)

  menuItem    MenuItem    @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  orderItems  OrderItem[]

  @@index([menuItemId])
}

model ExtraTopping {
  id          String      @id @default(cuid())
  nameDe      String      // e.g. "Büffelmozzarella DOP", "Salsiccia Fresca", "Rucola"
  nameEn      String
  price       Decimal     @db.Decimal(10, 2)
  isAvailable Boolean     @default(true)
  allergens   Allergen[]

  orderItemToppings OrderItemTopping[]
}

model Order {
  id              String         @id @default(cuid())
  orderNumber     String         @unique // e.g. "LN-2026-0001"
  userId          String?
  customerName    String
  customerEmail   String
  customerPhone   String
  pickupTime      DateTime
  orderStatus     OrderStatus    @default(PENDING)
  paymentStatus   PaymentStatus  @default(UNPAID)
  paymentMethod   PaymentMethod  @default(CASH_ON_PICKUP)
  stripePaymentId String?

  subtotalAmount  Decimal        @db.Decimal(10, 2)
  taxFoodAmount   Decimal        @db.Decimal(10, 2) // 10% VAT
  taxDrinkAmount  Decimal        @db.Decimal(10, 2) // 20% VAT
  discountAmount  Decimal        @default(0.00) @db.Decimal(10, 2)
  totalAmount     Decimal        @db.Decimal(10, 2)

  notes           String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  user            User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
  items           OrderItem[]

  @@index([orderStatus, createdAt])
  @@index([customerEmail])
  @@index([orderNumber])
}

model OrderItem {
  id            String              @id @default(cuid())
  orderId       String
  menuItemId    String
  variantId     String?
  quantity      Int                 @default(1)
  unitPrice     Decimal             @db.Decimal(10, 2)
  totalPrice    Decimal             @db.Decimal(10, 2)
  taxRate       Decimal             @db.Decimal(5, 2)

  order         Order               @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItem      MenuItem            @relation(fields: [menuItemId], references: [id], onDelete: Restrict)
  variant       ItemVariant?        @relation(fields: [variantId], references: [id], onDelete: SetNull)
  extraToppings OrderItemTopping[]

  @@index([orderId])
}

model OrderItemTopping {
  id             String        @id @default(cuid())
  orderItemId    String
  extraToppingId String
  price          Decimal       @db.Decimal(10, 2)

  orderItem      OrderItem     @relation(fields: [orderItemId], references: [id], onDelete: Cascade)
  topping        ExtraTopping  @relation(fields: [extraToppingId], references: [id], onDelete: Restrict)

  @@index([orderItemId])
}

model DiningTable {
  id          String         @id @default(cuid())
  tableNumber Int            @unique
  capacity    Int
  isIndoor    Boolean        @default(true)
  isActive    Boolean        @default(true)

  reservations Reservation[]
}

model Reservation {
  id              String            @id @default(cuid())
  reservationCode String            @unique // e.g. "RES-7821"
  userId          String?
  tableId         String?
  guestName       String
  guestEmail      String
  guestPhone      String
  partySize       Int
  reservationDate DateTime
  startTime       DateTime
  endTime         DateTime
  status          ReservationStatus @default(PENDING)
  specialRequests String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  user            User?             @relation(fields: [userId], references: [id], onDelete: SetNull)
  table           DiningTable?      @relation(fields: [tableId], references: [id], onDelete: SetNull)

  @@index([reservationDate, status])
  @@index([tableId, startTime, endTime])
}

model Review {
  id          String      @id @default(cuid())
  menuItemId  String?
  userId      String?
  authorName  String
  rating      Int         // 1 to 5
  comment     String
  isPublished Boolean     @default(false)
  createdAt   DateTime    @default(now())

  menuItem    MenuItem?   @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  user        User?       @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([menuItemId, isPublished])
}

model AuditLog {
  id         String      @id @default(cuid())
  userId     String?
  action     String      // e.g. "MENU_PRICE_UPDATE", "ORDER_CANCELLED"
  entityType String      // "MenuItem", "Order", "Reservation"
  entityId   String
  metadata   Json?
  ipAddress  String?
  createdAt  DateTime    @default(now())

  user       User?       @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([entityType, entityId])
  @@index([createdAt])
}
```
