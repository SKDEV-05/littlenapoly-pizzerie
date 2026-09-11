'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Instagram, Award, Heart, ExternalLink, Quote, MapPin } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface ReviewItem {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  quoteDe: string;
  quoteEn: string;
  pizzaMentioned: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 1,
    name: 'Markus W.',
    location: 'Wien / Himberg',
    rating: 5,
    date: 'Vor 2 Wochen',
    quoteDe:
      'Die beste neapolitanische Pizza im Bezirk! Der Rand ist unfassbar luftig mit tollem Leopardenmuster. Durch die bis zu 96 Stunden Teigruhe liegt die Pizza überhaupt nicht schwer im Magen. Fior di Latte und die San Marzano Sauce schmecken wie direkt in Neapel.',
    quoteEn:
      'The best Neapolitan pizza in the entire area! The crust is incredibly airy with wonderful leopard spotting. Thanks to up to 96 hours of dough maturation, it is extremely easy to digest. Tastes just like Naples!',
    pizzaMentioned: 'Regina Margherita D.O.P.',
  },
  {
    id: 2,
    name: 'Sophie M.',
    location: 'Himberg bei Wien',
    rating: 5,
    date: 'Vor 1 Monat',
    quoteDe:
      'Pizzaiolo Abed versteht sein Handwerk meisterhaft! Wir haben die Pizze Gialle mit gelben Datterini und echtem Büffelmozzarella probiert – absolut himmlisch und fruchtig-süß. Die Zutaten sind top D.O.P. Qualität.',
    quoteEn:
      'Pizzaiolo Abed is a true master of his craft! We tried the Pizze Gialle with sweet yellow datterini and genuine Buffalo Mozzarella – pure perfection. D.O.P. ingredients at their finest.',
    pizzaMentioned: 'Yellow Bufala',
  },
  {
    id: 3,
    name: 'Christoph B.',
    location: 'Schwechat',
    rating: 5,
    date: 'Vor 3 Wochen',
    quoteDe:
      'Ein echter Geheimtipp und absolutes Juwel! Wir fahren extra aus Schwechat nach Himberg für diese Pizza. Auch die Feinkost-Ecke mit Olivenöl und italienischen Weinen ist großartig. Weiter so!',
    quoteEn:
      'A true hidden gem! We drive specially from Schwechat to Himberg for this pizza. The Italian delicatessen selection with olive oil and wines is also outstanding.',
    pizzaMentioned: '4 Formaggi & Tartufo',
  },
];

const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: '/images/pizza-margherita.jpg',
    likes: '348',
    title: 'Regina Margherita',
    tag: '#napolitana',
  },
  {
    id: 2,
    image: '/images/uber-uns-oven.png',
    likes: '412',
    title: '485°C Steinofen',
    tag: '#fornoalegna',
  },
  {
    id: 3,
    image: '/images/pizza-gialla.jpg',
    likes: '289',
    title: 'Datterino Giallo',
    tag: '#pizzegialle',
  },
  {
    id: 4,
    image: '/images/pizza-diavola.jpg',
    likes: '520',
    title: 'Diavola Piccante',
    tag: '#salamepiccante',
  },
];

export function InstagramReviewsShowcase() {
  const { locale } = useI18n();

  return (
    <section className="relative py-16 sm:py-24 bg-[#FAF7F2] dark:bg-[#0C0806] border-t border-stone-200/90 dark:border-stone-800/80 transition-colors duration-300 overflow-hidden">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-napoli-red/5 dark:bg-napoli-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Top Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs mb-3">
            <div className="flex items-center h-2 w-6 rounded-xs overflow-hidden shrink-0">
              <span className="h-full w-1/3 bg-[#008C45]" />
              <span className="h-full w-1/3 bg-[#FFFFFF]" />
              <span className="h-full w-1/3 bg-[#CD212A]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-700 dark:text-stone-300">
              {locale === 'en' ? 'Authentic Social Proof & Instagram' : 'Echte Gästeerlebnisse & Instagram'}
            </span>
          </div>

          <h2 className="font-playfair italic text-3xl sm:text-4xl lg:text-5xl font-extrabold text-napoli-char dark:text-white tracking-tight leading-tight">
            {locale === 'en' ? 'Crafted with Love in Naples Style' : 'Aus Liebe zur echten Pizza Napoletana'}
          </h2>

          <p className="mt-3 text-stone-600 dark:text-stone-300 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            {locale === 'en'
              ? 'Up to 96 hours of dough fermentation, flour from the Amalfi Coast, and D.O.P. ingredients from southern Italy crafted by Pizzaiolo Abed in Himberg bei Wien.'
              : 'Bis zu 96 Stunden Teigruhe, Mehl von der Amalfiküste und zertifizierte D.O.P. Zutaten aus Süditalien – meisterhaft vollendet von Pizzaiolo Abed.'}
          </p>
        </div>

        {/* 2-Column Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Customer Reviews & Ratings Card (Span 6) */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Overall Rating Spotlight */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900/95 border border-stone-200/90 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-black/40 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-napoli-char dark:text-white">
                  4.9 <span className="text-sm font-normal text-stone-500 dark:text-stone-400">/ 5.0 Sterne</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {locale === 'en' ? 'Over 150+ Verified Google & Foodie Reviews' : 'Über 150+ verifizierte Gäste-Bewertungen auf Google'}
                </p>
              </div>

              <a
                href="https://maps.app.goo.gl/NwpN8geEfj8Cohis6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors shrink-0 shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-napoli-red" />
                <span>Google Maps öffnen</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-stone-400" />
              </a>
            </div>

            {/* Individual Reviews Carousel / Stack */}
            <div className="space-y-4">
              {REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 shadow-sm hover:shadow-md relative group"
                >
                  <Quote className="w-8 h-8 text-amber-500/15 dark:text-amber-500/10 absolute top-4 right-4 pointer-events-none" />
                  
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-stone-400">{review.date}</span>
                  </div>

                  <p className="text-stone-700 dark:text-stone-200 text-xs sm:text-sm leading-relaxed mb-3 italic">
                    &ldquo;{locale === 'en' ? review.quoteEn : review.quoteDe}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-stone-800/80">
                    <div className="font-bold text-stone-900 dark:text-white">
                      {review.name}{' '}
                      <span className="text-[11px] font-normal text-stone-400">({review.location})</span>
                    </div>
                    <span className="inline-block text-[11px] font-semibold text-napoli-red dark:text-red-400 bg-napoli-red/10 dark:bg-red-950/40 px-2.5 py-0.5 rounded-md">
                      {review.pizzaMentioned}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Master Pizzaiolo Abed & Instagram Photo Grid (Span 6) */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Master Pizzaiolo Abed Feature Spotlight (Flawless in Light & Dark Mode) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#201712] dark:to-[#110D0A] border border-amber-300/80 dark:border-amber-900/40 shadow-xl shadow-amber-900/5 dark:shadow-black/50 relative overflow-hidden transition-colors duration-300">
              {/* Subtle Warm Accent Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                {/* Pizzaiolo Photo */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-md shrink-0 bg-stone-950">
                  <Image
                    src="/images/pizzaiolo-abed.png"
                    alt="Pizzaiolo Abed - Little Napoli"
                    fill
                    sizes="112px"
                    className="object-cover object-top"
                  />
                </div>

                <div className="text-center sm:text-left space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 dark:bg-amber-500/25 text-amber-900 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                    <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    Maestro Pizzaiolo
                  </div>
                  <h3 className="font-playfair italic text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                    Pizzaiolo Abed &amp; Team
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-md font-medium">
                    {locale === 'en'
                      ? 'Every pizza is handcrafted with precision, passion, and Amalfi Coast recipes passed down through generations. Fermented for up to 96 hours for ultimate lightness.'
                      : 'Jede Pizza wird von Pizzaiolo Abed mit Hingabe zubereitet – nach überlieferten Rezepten der Amalfiküste und bis zu 96 Stunden Teigruhe für unvergleichliche Leichtigkeit.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Instagram Live Feed Grid */}
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/95 border border-stone-200/90 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-black/50 space-y-5 transition-colors duration-300">
              {/* Instagram Handle & CTA Header */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  {/* Vibrant Instagram Icon Gradient Badge */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-md shrink-0">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white leading-tight">
                      @little_napoli_pizzeria
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Offizieller Instagram-Kanal • Himberg
                    </p>
                  </div>
                </div>

                {/* Vibrant Instagram Follow Button */}
                <a
                  href="https://www.instagram.com/little_napoli_pizzeria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/20 shrink-0"
                >
                  <Instagram className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-bold">{locale === 'en' ? 'Follow on Instagram' : 'Auf Instagram Folgen'}</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              </div>

              {/* 4-Image Feed Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INSTAGRAM_POSTS.map((post) => (
                  <a
                    key={post.id}
                    href="https://www.instagram.com/little_napoli_pizzeria/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 block"
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Hover Overlay with Likes & Tag */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white text-center">
                      <div className="flex items-center gap-1 text-xs font-bold">
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        <span>{post.likes}</span>
                      </div>
                      <span className="text-[10px] text-stone-300 mt-1 font-mono">{post.tag}</span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Tagline Footer */}
              <div className="pt-2 text-center border-t border-stone-100 dark:border-stone-800">
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Tagge uns auf deinen Fotos mit <strong className="text-napoli-red dark:text-red-400 font-bold">#LittleNapoliHimberg</strong> für ein Feature auf unserer Seite!
                </p>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
