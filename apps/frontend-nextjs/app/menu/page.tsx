import { MenuGrid } from '@/components/sections/MenuGrid';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: "Speisekarte | Little Napoli Himberg bei Wien",
  description: "Entdecken Sie alle 51 Spezialitäten von Little Napoli: Le Pizze Classiche, Pizze Gialle, Calzone, frische Pasta, Dolci und italienische Biere.",
};

export default function MenuPage() {
  return (
    <div className="py-10 bg-gradient-to-b from-[#FBF0DF] via-stone-50 to-[#F5ECE1] dark:from-[#110D0A] dark:via-[#16120F] dark:to-[#0C0908] min-h-screen transition-colors duration-300">
      <div className="container px-4 md:px-8 pb-4">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <Badge variant="napoli" className="bg-napoli-red text-white font-bold">
            Original Neapolitanisch • 485°C Holzofen
          </Badge>
          <h1 className="font-poppins text-4xl sm:text-5xl font-extrabold text-stone-900 dark:text-white">
            Unsere Speisekarte
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Alle 51 Gerichte werden frisch mit zertifizierten D.O.P. Zutaten nach traditionellen italienischen Rezepten zubereitet. Nutzen Sie die Kategorie- und Preisfilter, um Ihre Lieblingsspezialität zu wählen.
          </p>
        </div>
      </div>

      <MenuGrid showHeader={false} />
    </div>
  );
}
