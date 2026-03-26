<?php

namespace Database\Seeders;

use App\Models\TourGuide;
use Illuminate\Database\Seeder;

class TourGuideSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tourGuides = [
            [
                'name' => 'Sarah Johnson',
                'photo' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
                'description' => 'Expert in European history and culture with 10 years of experience. Specializing in museum tours and historical sites.',
                'rating' => 5,
                'location' => 'Paris, France',
                'experience_years' => 10,
                'languages' => 'English, French, Spanish',
                'hire_cost' => 160.00,
                'phone' => '+33 1 23 45 67 89',
                'email' => 'sarah.johnson@travelworld.com'
            ],
            [
                'name' => 'Michael Chen',
                'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'description' => 'Specialist in Asian tours and culinary experiences across the continent. Expert in street food and local cuisine.',
                'rating' => 4,
                'location' => 'Tokyo, Japan',
                'experience_years' => 8,
                'languages' => 'English, Japanese, Mandarin',
                'hire_cost' => 145.00,
                'phone' => '+81 3-1234-5678',
                'email' => 'michael.chen@travelworld.com'
            ],
            [
                'name' => 'Emma Williams',
                'photo' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
                'description' => 'Adventure tourism expert focusing on outdoor activities, wildlife safaris, and nature expeditions.',
                'rating' => 5,
                'location' => 'Cape Town, South Africa',
                'experience_years' => 7,
                'languages' => 'English, Afrikaans, German',
                'hire_cost' => 130.00,
                'phone' => '+27 21 123 4567',
                'email' => 'emma.williams@travelworld.com'
            ],
            [
                'name' => 'Carlos Rodriguez',
                'photo' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                'description' => 'Latin America specialist with deep knowledge of ancient civilizations and vibrant local cultures.',
                'rating' => 5,
                'location' => 'Mexico City, Mexico',
                'experience_years' => 12,
                'languages' => 'English, Spanish, Portuguese',
                'hire_cost' => 175.00,
                'phone' => '+52 55 1234 5678',
                'email' => 'carlos.rodriguez@travelworld.com'
            ],
            [
                'name' => 'Lisa Thompson',
                'photo' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                'description' => 'Oceania expert specializing in marine life, Great Barrier Reef, and Australian outback adventures.',
                'rating' => 4,
                'location' => 'Sydney, Australia',
                'experience_years' => 6,
                'languages' => 'English, French',
                'hire_cost' => 125.00,
                'phone' => '+61 2 1234 5678',
                'email' => 'lisa.thompson@travelworld.com'
            ],
            [
                'name' => 'Ahmed Hassan',
                'photo' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
                'description' => 'Middle East expert with extensive knowledge of ancient ruins, desert safaris, and local traditions.',
                'rating' => 5,
                'location' => 'Dubai, UAE',
                'experience_years' => 9,
                'languages' => 'English, Arabic, Hindi',
                'hire_cost' => 155.00,
                'phone' => '+971 4 123 4567',
                'email' => 'ahmed.hassan@travelworld.com'
            ]
        ];

        foreach ($tourGuides as $guide) {
            TourGuide::updateOrCreate(
                ['email' => $guide['email']],
                $guide
            );
        }
    }
}
