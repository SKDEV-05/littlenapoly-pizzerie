import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Receipt } from 'lucide-react';

interface TaxSummaryCardProps {
  foodGross: number;
  foodNet: number;
  foodVat10: number;
  drinkGross: number;
  drinkNet: number;
  drinkVat20: number;
  totalVat: number;
  totalAmount: number;
}

export function TaxSummaryCard({
  foodGross,
  foodNet,
  foodVat10,
  drinkGross,
  drinkNet,
  drinkVat20,
  totalVat,
  totalAmount,
}: TaxSummaryCardProps) {
  const formatEuro = (amount: number) =>
    new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <Card className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1411] shadow-md sm:shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-3 border-b border-stone-100 dark:border-stone-800">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-bold text-stone-900 dark:text-white font-poppins">
          <Receipt className="w-4 h-4 text-napoli-red shrink-0" />
          <span>Steuer- & Preisaufschlüsselung (UStG Österreich)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-3 text-sm">
        {foodGross > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-stone-600 dark:text-stone-300">
              <span>Speisen Netto (10% USt):</span>
              <span className="font-mono font-medium">{formatEuro(foodNet)}</span>
            </div>
            <div className="flex justify-between text-stone-500 dark:text-stone-400 text-xs pl-2">
              <span>+ 10% USt auf Speisen:</span>
              <span className="font-mono">{formatEuro(foodVat10)}</span>
            </div>
          </div>
        )}

        {drinkGross > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-stone-600 dark:text-stone-300">
              <span>Getränke Netto (20% USt):</span>
              <span className="font-mono font-medium">{formatEuro(drinkNet)}</span>
            </div>
            <div className="flex justify-between text-stone-500 dark:text-stone-400 text-xs pl-2">
              <span>+ 20% USt auf Getränke:</span>
              <span className="font-mono">{formatEuro(drinkVat20)}</span>
            </div>
          </div>
        )}

        <Separator className="my-2 bg-stone-100 dark:bg-stone-800" />

        <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>Gesamte enthaltene Umsatzsteuer:</span>
          <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">{formatEuro(totalVat)}</span>
        </div>

        <div className="flex justify-between items-center text-base sm:text-lg font-bold text-stone-900 dark:text-white pt-2 border-t border-dashed border-stone-200 dark:border-stone-800">
          <span>Gesamtbetrag (Brutto):</span>
          <span className="text-napoli-red dark:text-red-400 font-poppins text-xl sm:text-2xl font-black shrink-0">
            {formatEuro(totalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
