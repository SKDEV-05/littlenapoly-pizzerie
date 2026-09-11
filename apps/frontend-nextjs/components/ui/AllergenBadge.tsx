'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info } from 'lucide-react';

export interface AllergenInfo {
  code: string;
  name: string;
  description: string;
}

export const AUSTRIAN_ALLERGEN_MAP: Record<string, { name: string; description: string }> = {
  A: {
    name: 'Glutenhaltiges Getreide',
    description: 'Weizen, Roggen, Gerste, Hafer, Dinkel, Kamut oder Hybridstämme.',
  },
  B: {
    name: 'Krebstiere',
    description: 'Krebse, Garnelen, Krabben, Hummer und Erzeugnisse daraus.',
  },
  C: {
    name: 'Eier',
    description: 'Eier von Geflügel und Erzeugnisse daraus.',
  },
  D: {
    name: 'Fisch',
    description: 'Fische aller Art und Erzeugnisse daraus (z.B. Sardellen, Thunfisch).',
  },
  E: {
    name: 'Erdnuss',
    description: 'Erdnüsse und Erzeugnisse daraus.',
  },
  F: {
    name: 'Soja',
    description: 'Sojabohnen und Erzeugnisse daraus.',
  },
  G: {
    name: 'Milch / Laktose',
    description: 'Fior di Latte, Büffelmozzarella D.O.P., Ricotta, Gorgonzola, Grana Padano.',
  },
  H: {
    name: 'Schalenfrüchte / Nüsse',
    description: 'Pistazien, Mandeln, Haselnüsse, Walnüsse und Pistaziencreme.',
  },
  L: {
    name: 'Sellerie',
    description: 'Knollensellerie, Staudensellerie und Erzeugnisse daraus.',
  },
  M: {
    name: 'Senf',
    description: 'Senfkörner, Senfpulver und Erzeugnisse daraus.',
  },
  N: {
    name: 'Sesam',
    description: 'Sesamsamen und Erzeugnisse daraus.',
  },
  O: {
    name: 'Sulfite',
    description: 'Schwefeldioxid und Sulfite (z.B. in Weinen oder getrockneten Zutaten).',
  },
  P: {
    name: 'Lupinen',
    description: 'Lupinen und Erzeugnisse daraus.',
  },
  R: {
    name: 'Weichtiere',
    description: 'Schnecken, Muscheln, Tintenfische und Erzeugnisse daraus.',
  },
};

interface AllergenBadgeProps {
  code: string;
  showPopover?: boolean;
}

export function AllergenBadge({ code, showPopover = true }: AllergenBadgeProps) {
  const allergen = AUSTRIAN_ALLERGEN_MAP[code] || {
    name: `Allergen ${code}`,
    description: 'Austrian Codex Alimentarius Standard.',
  };

  if (!showPopover) {
    return (
      <Badge variant="allergen" title={`${code}: ${allergen.name}`}>
        {code}
      </Badge>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex focus:outline-none focus:ring-1 focus:ring-napoli-red rounded-full"
          aria-label={`Allergen-Info für ${code}`}
        >
          <Badge variant="allergen" className="transition-transform hover:scale-110 active:scale-95">
            {code}
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-white dark:bg-[#1E1714] border border-stone-200 dark:border-stone-800 shadow-xl rounded-xl text-left" side="top">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-napoli-red/15 text-napoli-red flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            {code}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-stone-900 dark:text-white">{allergen.name}</h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
              {allergen.description}
            </p>
            <span className="inline-block mt-2 text-[10px] text-stone-400 dark:text-stone-500 font-mono">
              Codex Alimentarius Österreich
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
