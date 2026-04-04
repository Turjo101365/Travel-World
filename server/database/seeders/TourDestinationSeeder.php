<?php

namespace Database\Seeders;

use App\Models\TourDestination;
use Illuminate\Database\Seeder;

class TourDestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $destinations = [
            [
                'slug' => 'paris-france',
                'title' => 'Paris Highlights',
                'country' => 'France',
                'city' => 'Paris',
                'location_label' => 'Paris, France',
                'image' => 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'Art, architecture, elegant streets, and unforgettable local culture.',
                'description' => 'Paris offers a rich blend of iconic landmarks, riverside walks, museums, historic neighborhoods, and refined food culture. Travelers can explore famous attractions while also discovering hidden streets, boutique cafes, and local stories with an experienced guide.',
                'duration' => '5 Days',
                'price' => '$1,899',
                'rating' => 4.9,
            ],
            [
                'slug' => 'tokyo-japan',
                'title' => 'Tokyo Adventure',
                'country' => 'Japan',
                'city' => 'Tokyo',
                'location_label' => 'Tokyo, Japan',
                'image' => 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'Modern city energy mixed with deep tradition and local food journeys.',
                'description' => 'Tokyo is ideal for visitors who want to experience fast-moving city life, rich tradition, authentic neighborhoods, and world-famous food. A destination guide helps travelers plan a smooth route through markets, temples, shopping zones, and skyline experiences.',
                'duration' => '6 Days',
                'price' => '$2,249',
                'rating' => 4.8,
            ],
            [
                'slug' => 'cape-town-south-africa',
                'title' => 'Cape Town Escape',
                'country' => 'South Africa',
                'city' => 'Cape Town',
                'location_label' => 'Cape Town, South Africa',
                'image' => 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'Coastal drives, mountain views, wildlife, and outdoor adventures.',
                'description' => 'Cape Town combines natural beauty, adventure activities, scenic coastlines, and cultural experiences. With the right guide, travelers can balance mountain viewpoints, local history, waterfront attractions, and safari-style experiences in one carefully planned trip.',
                'duration' => '7 Days',
                'price' => '$1,749',
                'rating' => 4.9,
            ],
            [
                'slug' => 'mexico-city-mexico',
                'title' => 'Mexico City Heritage',
                'country' => 'Mexico',
                'city' => 'Mexico City',
                'location_label' => 'Mexico City, Mexico',
                'image' => 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'Historic landmarks, museums, markets, and bold local flavors.',
                'description' => 'Mexico City is a vibrant destination full of history, architecture, food, and contemporary culture. A local guide can help visitors move confidently between heritage sites, art districts, traditional markets, and authentic food experiences.',
                'duration' => '5 Days',
                'price' => '$1,629',
                'rating' => 4.8,
            ],
            [
                'slug' => 'dubai-uae',
                'title' => 'Dubai Luxury',
                'country' => 'UAE',
                'city' => 'Dubai',
                'location_label' => 'Dubai, UAE',
                'image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'Premium city experiences, modern landmarks, and desert activities.',
                'description' => 'Dubai is perfect for travelers looking for a polished mix of modern architecture, shopping, luxury hospitality, and desert adventure. A local guide can help build an efficient and enjoyable itinerary across famous attractions and local cultural stops.',
                'duration' => '4 Days',
                'price' => '$2,099',
                'rating' => 4.9,
            ],
        ];

        foreach ($destinations as $destination) {
            TourDestination::updateOrCreate(
                ['slug' => $destination['slug']],
                $destination
            );
        }
    }
}
