<?php

namespace Database\Seeders;

use App\Models\TourDestination;
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
        $destinationIds = TourDestination::query()
            ->pluck('id', 'slug')
            ->all();

        $tourGuides = [
            [
                'destination_slug' => 'paris-france',
                'name' => 'Sarah Johnson',
                'photo' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
                'description' => 'Expert in European history and culture with deep experience in museum tours, walking routes, and hidden Paris landmarks.',
                'rating' => 5,
                'location' => 'Paris, France',
                'experience_years' => 10,
                'languages' => 'English, French, Spanish',
                'hire_cost' => 160.00,
                'phone' => '+33 1 23 45 67 89',
                'email' => 'sarah.johnson@travelworld.com',
            ],
            [
                'destination_slug' => 'paris-france',
                'name' => 'Julien Moreau',
                'photo' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                'description' => 'Paris local guide focused on food streets, riverside neighborhoods, and lifestyle-driven city experiences.',
                'rating' => 4,
                'location' => 'Paris, France',
                'experience_years' => 7,
                'languages' => 'French, English, Italian',
                'hire_cost' => 148.00,
                'phone' => '+33 1 45 61 70 22',
                'email' => 'julien.moreau@travelworld.com',
            ],
            [
                'destination_slug' => 'paris-france',
                'name' => 'Claire Dubois',
                'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                'description' => 'Specializes in art tours, shopping districts, cafe culture, and family-friendly Paris itineraries.',
                'rating' => 5,
                'location' => 'Paris, France',
                'experience_years' => 8,
                'languages' => 'French, English, German',
                'hire_cost' => 154.00,
                'phone' => '+33 1 40 22 19 80',
                'email' => 'claire.dubois@travelworld.com',
            ],
            [
                'destination_slug' => 'tokyo-japan',
                'name' => 'Michael Chen',
                'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'description' => 'Specialist in Tokyo city tours, culinary experiences, and navigating popular districts with ease.',
                'rating' => 4,
                'location' => 'Tokyo, Japan',
                'experience_years' => 8,
                'languages' => 'English, Japanese, Mandarin',
                'hire_cost' => 145.00,
                'phone' => '+81 3-1234-5678',
                'email' => 'michael.chen@travelworld.com',
            ],
            [
                'destination_slug' => 'tokyo-japan',
                'name' => 'Aiko Tanaka',
                'photo' => 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80',
                'description' => 'Tokyo guide known for cultural districts, temple routes, photography spots, and calm neighborhood experiences.',
                'rating' => 5,
                'location' => 'Tokyo, Japan',
                'experience_years' => 9,
                'languages' => 'Japanese, English, Korean',
                'hire_cost' => 158.00,
                'phone' => '+81 3-4821-1122',
                'email' => 'aiko.tanaka@travelworld.com',
            ],
            [
                'destination_slug' => 'tokyo-japan',
                'name' => 'Kenji Sato',
                'photo' => 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80',
                'description' => 'Best for fast-paced Tokyo itineraries including food markets, modern districts, and nightlife planning.',
                'rating' => 4,
                'location' => 'Tokyo, Japan',
                'experience_years' => 6,
                'languages' => 'Japanese, English',
                'hire_cost' => 139.00,
                'phone' => '+81 3-6712-8801',
                'email' => 'kenji.sato@travelworld.com',
            ],
            [
                'destination_slug' => 'cape-town-south-africa',
                'name' => 'Emma Williams',
                'photo' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
                'description' => 'Adventure tourism expert focusing on mountain routes, wildlife stops, and open-air travel experiences.',
                'rating' => 5,
                'location' => 'Cape Town, South Africa',
                'experience_years' => 7,
                'languages' => 'English, Afrikaans, German',
                'hire_cost' => 130.00,
                'phone' => '+27 21 123 4567',
                'email' => 'emma.williams@travelworld.com',
            ],
            [
                'destination_slug' => 'cape-town-south-africa',
                'name' => 'Thabo Maseko',
                'photo' => 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=400&q=80',
                'description' => 'Experienced local guide for scenic drives, township culture, and Cape Town waterfront experiences.',
                'rating' => 5,
                'location' => 'Cape Town, South Africa',
                'experience_years' => 11,
                'languages' => 'English, Zulu, Afrikaans',
                'hire_cost' => 149.00,
                'phone' => '+27 21 882 4477',
                'email' => 'thabo.maseko@travelworld.com',
            ],
            [
                'destination_slug' => 'cape-town-south-africa',
                'name' => 'Naledi Jacobs',
                'photo' => 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=400&q=80',
                'description' => 'Ideal for travelers who want nature, relaxed pacing, local food stops, and memorable landscape photography.',
                'rating' => 4,
                'location' => 'Cape Town, South Africa',
                'experience_years' => 6,
                'languages' => 'English, Afrikaans',
                'hire_cost' => 136.00,
                'phone' => '+27 21 300 1166',
                'email' => 'naledi.jacobs@travelworld.com',
            ],
            [
                'destination_slug' => 'mexico-city-mexico',
                'name' => 'Carlos Rodriguez',
                'photo' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                'description' => 'Latin America specialist with strong knowledge of heritage sites, museums, and vibrant city culture.',
                'rating' => 5,
                'location' => 'Mexico City, Mexico',
                'experience_years' => 12,
                'languages' => 'English, Spanish, Portuguese',
                'hire_cost' => 175.00,
                'phone' => '+52 55 1234 5678',
                'email' => 'carlos.rodriguez@travelworld.com',
            ],
            [
                'destination_slug' => 'mexico-city-mexico',
                'name' => 'Sofia Martinez',
                'photo' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
                'description' => 'Focuses on local markets, food neighborhoods, museum routes, and culture-rich walking itineraries.',
                'rating' => 4,
                'location' => 'Mexico City, Mexico',
                'experience_years' => 8,
                'languages' => 'Spanish, English',
                'hire_cost' => 152.00,
                'phone' => '+52 55 3333 1290',
                'email' => 'sofia.martinez@travelworld.com',
            ],
            [
                'destination_slug' => 'mexico-city-mexico',
                'name' => 'Diego Herrera',
                'photo' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
                'description' => 'Well suited for travelers wanting flexible city exploration, historical context, and authentic food stops.',
                'rating' => 5,
                'location' => 'Mexico City, Mexico',
                'experience_years' => 9,
                'languages' => 'Spanish, English, French',
                'hire_cost' => 158.00,
                'phone' => '+52 55 8841 2200',
                'email' => 'diego.herrera@travelworld.com',
            ],
            [
                'destination_slug' => 'dubai-uae',
                'name' => 'Ahmed Hassan',
                'photo' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
                'description' => 'Middle East expert with strong knowledge of desert safaris, landmarks, and local traditions in Dubai.',
                'rating' => 5,
                'location' => 'Dubai, UAE',
                'experience_years' => 9,
                'languages' => 'English, Arabic, Hindi',
                'hire_cost' => 155.00,
                'phone' => '+971 4 123 4567',
                'email' => 'ahmed.hassan@travelworld.com',
            ],
            [
                'destination_slug' => 'dubai-uae',
                'name' => 'Fatima Al Noor',
                'photo' => 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
                'description' => 'Perfect for premium city itineraries, shopping routes, and elegant Dubai evening experiences.',
                'rating' => 5,
                'location' => 'Dubai, UAE',
                'experience_years' => 8,
                'languages' => 'Arabic, English',
                'hire_cost' => 168.00,
                'phone' => '+971 4 881 0090',
                'email' => 'fatima.alnoor@travelworld.com',
            ],
            [
                'destination_slug' => 'dubai-uae',
                'name' => 'Omar Rahman',
                'photo' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                'description' => 'Known for efficient Dubai city planning with a balanced mix of modern attractions and cultural stops.',
                'rating' => 4,
                'location' => 'Dubai, UAE',
                'experience_years' => 7,
                'languages' => 'Arabic, English, Urdu',
                'hire_cost' => 147.00,
                'phone' => '+971 4 554 7721',
                'email' => 'omar.rahman@travelworld.com',
            ],
        ];

        foreach ($tourGuides as $guide) {
            $destinationSlug = $guide['destination_slug'];
            unset($guide['destination_slug']);

            $guide['destination_id'] = $destinationIds[$destinationSlug] ?? null;

            TourGuide::updateOrCreate(
                ['email' => $guide['email']],
                $guide
            );
        }
    }
}
