<?php

namespace Database\Seeders;

use App\Models\TourPackage;
use Illuminate\Database\Seeder;

class TourPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TourPackage::create([
            'title' => 'European Adventure',
            'description' => 'Explore the best of Europe with guided tours through Paris, Rome, and Barcelona. Includes accommodation and meals.',
            'price' => 2500.00,
            'duration' => 14,
            'location' => 'Paris, Rome, Barcelona',
            'max_participants' => 20,
            'image_url' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
        ]);

        TourPackage::create([
            'title' => 'Asian Culinary Journey',
            'description' => 'Discover the rich culinary traditions of Asia with expert guides. Visit local markets and cooking classes.',
            'price' => 1800.00,
            'duration' => 10,
            'location' => 'Tokyo, Bangkok, Singapore',
            'max_participants' => 15,
            'image_url' => 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
        ]);

        TourPackage::create([
            'title' => 'African Safari Experience',
            'description' => 'Witness wildlife in their natural habitat on this thrilling safari adventure through Kenya and Tanzania.',
            'price' => 3200.00,
            'duration' => 12,
            'location' => 'Kenya, Tanzania',
            'max_participants' => 12,
            'image_url' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
        ]);

        TourPackage::create([
            'title' => 'Mediterranean Cruise',
            'description' => 'Sail the beautiful Mediterranean Sea with stops in Greece, Italy, and Spain. Luxury cruise experience.',
            'price' => 2800.00,
            'duration' => 8,
            'location' => 'Athens, Naples, Valencia',
            'max_participants' => 100,
            'image_url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        ]);

        TourPackage::create([
            'title' => 'Northern Lights Adventure',
            'description' => 'Chase the aurora borealis in Iceland and Norway. Includes glacier hikes and hot spring visits.',
            'price' => 2200.00,
            'duration' => 7,
            'location' => 'Reykjavik, Tromso',
            'max_participants' => 10,
            'image_url' => 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80',
        ]);
    }
}