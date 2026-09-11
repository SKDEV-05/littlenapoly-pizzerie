<?php

namespace Database\Seeders;

use App\Models\Allergen;
use Illuminate\Database\Seeder;

class AllergenSeeder extends Seeder
{
    public function run(): void
    {
        $allergens = [
            [
                'code'           => 'A',
                'name_de'        => 'Glutenhaltiges Getreide',
                'name_en'        => 'Cereals containing gluten',
                'description_de' => 'Weizen, Roggen, Gerste, Hafer, Dinkel, Kamut oder Hybridstämme davon.',
                'description_en' => 'Wheat, rye, barley, oats, spelt, kamut or their hybridized strains.',
            ],
            [
                'code'           => 'B',
                'name_de'        => 'Krebstiere',
                'name_en'        => 'Crustaceans',
                'description_de' => 'Krebse, Garnelen, Krabben, Hummer etc. und Erzeugnisse daraus.',
                'description_en' => 'Crabs, lobsters, prawns and products thereof.',
            ],
            [
                'code'           => 'C',
                'name_de'        => 'Eier',
                'name_en'        => 'Eggs',
                'description_de' => 'Eier von Geflügel und Erzeugnisse daraus.',
                'description_en' => 'Eggs and egg products.',
            ],
            [
                'code'           => 'D',
                'name_de'        => 'Fisch',
                'name_en'        => 'Fish',
                'description_de' => 'Fische aller Art und Erzeugnisse daraus.',
                'description_en' => 'Fish and products thereof.',
            ],
            [
                'code'           => 'E',
                'name_de'        => 'Erdnuss',
                'name_en'        => 'Peanuts',
                'description_de' => 'Erdnüsse und Erzeugnisse daraus.',
                'description_en' => 'Peanuts and products thereof.',
            ],
            [
                'code'           => 'F',
                'name_de'        => 'Soja',
                'name_en'        => 'Soybeans',
                'description_de' => 'Sojabohnen und Erzeugnisse daraus.',
                'description_en' => 'Soybeans and products thereof.',
            ],
            [
                'code'           => 'G',
                'name_de'        => 'Milch / Laktose',
                'name_en'        => 'Milk / Lactose',
                'description_de' => 'Milch von Säugetieren und Milcherzeugnisse (einschließlich Laktose).',
                'description_en' => 'Milk and products thereof (including lactose).',
            ],
            [
                'code'           => 'H',
                'name_de'        => 'Schalenfrüchte / Nüsse',
                'name_en'        => 'Nuts',
                'description_de' => 'Mandeln, Haselnüsse, Walnüsse, Cashewnüsse, Pekannüsse, Paranüsse, Pistazien, Macadamianüsse.',
                'description_en' => 'Almonds, hazelnuts, walnuts, cashews, pecans, brazil nuts, pistachios, macadamia nuts.',
            ],
            [
                'code'           => 'L',
                'name_de'        => 'Sellerie',
                'name_en'        => 'Celery',
                'description_de' => 'Bleichsellerie, Knollensellerie, Staudensellerie und Erzeugnisse daraus.',
                'description_en' => 'Celery and products thereof.',
            ],
            [
                'code'           => 'M',
                'name_de'        => 'Senf',
                'name_en'        => 'Mustard',
                'description_de' => 'Senfkörner, Senfpulver und Erzeugnisse daraus.',
                'description_en' => 'Mustard and products thereof.',
            ],
            [
                'code'           => 'N',
                'name_de'        => 'Sesam',
                'name_en'        => 'Sesame seeds',
                'description_de' => 'Sesamsamen und Erzeugnisse daraus.',
                'description_en' => 'Sesame seeds and products thereof.',
            ],
            [
                'code'           => 'O',
                'name_de'        => 'Sulfite / Schwefeldioxid',
                'name_en'        => 'Sulphur dioxide / Sulphites',
                'description_de' => 'Schwefeldioxid und Sulfite in Konzentrationen von mehr als 10 mg/kg oder 10 mg/l.',
                'description_en' => 'Sulphur dioxide and sulphites at concentrations of more than 10 mg/kg or 10 mg/litre.',
            ],
            [
                'code'           => 'P',
                'name_de'        => 'Lupinen',
                'name_en'        => 'Lupin',
                'description_de' => 'Lupinen und Erzeugnisse daraus.',
                'description_en' => 'Lupin and products thereof.',
            ],
            [
                'code'           => 'R',
                'name_de'        => 'Weichtiere',
                'name_en'        => 'Molluscs',
                'description_de' => 'Schnecken, Muscheln, Tintenfische, Tintenfisch und Erzeugnisse daraus.',
                'description_en' => 'Molluscs such as mussels, clams, oysters, squid and products thereof.',
            ],
        ];

        foreach ($allergens as $allergenData) {
            Allergen::updateOrCreate(['code' => $allergenData['code']], $allergenData);
        }
    }
}
