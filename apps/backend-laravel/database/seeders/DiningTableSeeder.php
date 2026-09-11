<?php

namespace Database\Seeders;

use App\Models\DiningTable;
use Illuminate\Database\Seeder;

class DiningTableSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            ['table_number' => 1, 'capacity' => 2, 'is_indoor' => true],
            ['table_number' => 2, 'capacity' => 2, 'is_indoor' => true],
            ['table_number' => 3, 'capacity' => 4, 'is_indoor' => true],
            ['table_number' => 4, 'capacity' => 4, 'is_indoor' => true],
            ['table_number' => 5, 'capacity' => 4, 'is_indoor' => true],
            ['table_number' => 6, 'capacity' => 6, 'is_indoor' => true],
            ['table_number' => 7, 'capacity' => 6, 'is_indoor' => true],
            ['table_number' => 8, 'capacity' => 8, 'is_indoor' => true],
            ['table_number' => 9, 'capacity' => 2, 'is_indoor' => false], // Terrace
            ['table_number' => 10, 'capacity' => 4, 'is_indoor' => false], // Terrace
            ['table_number' => 11, 'capacity' => 4, 'is_indoor' => false], // Terrace
            ['table_number' => 12, 'capacity' => 6, 'is_indoor' => false], // Terrace
        ];

        foreach ($tables as $tableData) {
            DiningTable::updateOrCreate(
                ['table_number' => $tableData['table_number']],
                $tableData
            );
        }
    }
}
