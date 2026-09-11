import React from 'react';
import { CiaoPizzaHero } from '@/components/sections/CiaoPizzaHero';
import { CategoriesShowcase } from '@/components/sections/CategoriesShowcase';
import { InstagramReviewsShowcase } from '@/components/sections/InstagramReviewsShowcase';
import { ReservationBanner } from '@/components/sections/ReservationBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Dribbble-Style Top Pizzas Showcase Hero */}
      <CiaoPizzaHero />

      {/* 2. Luxury Categories Showcase (Girls Beauty Style) + Top 8 Curated Bestsellers */}
      <CategoriesShowcase />

      {/* 3. Authentic Social Proof, Reviews & Instagram Showcase */}
      <InstagramReviewsShowcase />

      {/* 4. Table Reservation & Direct Dial Banner */}
      <ReservationBanner />
    </div>
  );
}
