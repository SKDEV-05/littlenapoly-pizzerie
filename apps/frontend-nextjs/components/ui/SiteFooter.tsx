'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Clock, Instagram, ExternalLink } from 'lucide-react';

export function SiteFooter() {
  const pathname = usePathname();

  // Hide the public footer completely inside the Admin Dashboard
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-stone-800 bg-[#0E0A08] text-white py-14 sm:py-16">
      <div className="container px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10">
        {/* Brand & Logo Column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-stone-700 shadow-xl bg-black shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo.jpg"
                alt="Little Napoli Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-playfair italic font-black text-2xl text-white tracking-tight leading-none">
                Little Napoli
              </span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400 mt-1">
                L&apos;Autentica Pizza Napoletana
              </span>
              {/* Italian Tricolore */}
              <div className="flex items-center h-1.5 w-7 rounded-sm overflow-hidden shadow-xs mt-1">
                <span className="w-1/3 h-full bg-[#009246]" />
                <span className="w-1/3 h-full bg-[#FFFFFF]" />
                <span className="w-1/3 h-full bg-[#CE2B37]" />
              </div>
            </div>
          </Link>

          <p className="text-xs text-stone-300 leading-relaxed font-medium">
            Traditionelle neapolitanische Holzofenpizza mit 485°C Backhitze, bis zu 96 Stunden Teigruhe und echten D.O.P. Zutaten direkt aus Kampanien.
          </p>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <a
              href="https://www.instagram.com/little_napoli_pizzeria/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/40 text-xs font-bold text-pink-300 hover:text-white hover:bg-pink-600/30 transition-all shadow-sm"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>@little_napoli_pizzeria</span>
            </a>

            <a
              href="https://littlenapoli.at"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-all"
            >
              <span>littlenapoli.at</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>
        </div>

        {/* Standort & Kontakt */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-napoli-yellow uppercase tracking-wider">Standort & Kontakt</h4>
          <p className="text-xs text-stone-300 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-napoli-red shrink-0 mt-0.5" />
            <span>Hauptstraße 44, 2325 Himberg bei Wien, Österreich</span>
          </p>
          <div className="pt-1">
            <span className="text-[11px] text-stone-400 block mb-1">Telefonische Bestellung & Reservierung:</span>
            <a
              href="tel:+43223542733"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-napoli-yellow text-napoli-char font-mono text-sm font-bold shadow-md hover:bg-napoli-yellowLight transition-all"
              aria-label="Rufen Sie uns an: +43 2235 42733"
            >
              <Phone className="w-4 h-4 text-napoli-char" />
              +43 2235 42733
            </a>
          </div>
        </div>

        {/* Öffnungszeiten */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-napoli-yellow uppercase tracking-wider">Öffnungszeiten</h4>
          <p className="text-xs text-stone-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-napoli-red shrink-0" />
            Dienstag – Sonntag: 11:00 – 22:00
          </p>
          <p className="text-xs text-stone-400">
            Montag: Ruhetag (Ofen geschlossen)
          </p>
          <p className="text-[11px] text-stone-400 pt-1">
            Küche schließt um 21:45 Uhr.
          </p>
        </div>

        {/* Downloads & Rechtliches */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-napoli-yellow uppercase tracking-wider">Downloads & Rechtliches</h4>
          <ul className="text-xs text-stone-300 space-y-1.5">
            <li>
              <a
                href="https://littlenapoli.at/wp-content/uploads/2026/01/little-napoli-2026-web.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-napoli-yellow hover:underline font-semibold flex items-center gap-1"
              >
                📖 Speisekarte 2026 (PDF Download)
              </a>
            </li>
            <li><Link href="/impressum" className="hover:underline">Impressum (§5 ECG)</Link></li>
            <li><Link href="/datenschutz" className="hover:underline">Datenschutzerklärung (DSGVO)</Link></li>
            <li><span className="text-stone-400">UID: ATU-Gastronomie Österreich</span></li>
          </ul>
        </div>
      </div>

      <div className="container px-4 md:px-8 mt-10 pt-6 border-t border-stone-800/80 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Little Napoli - L&apos;Autentica Pizza Napoletana. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
