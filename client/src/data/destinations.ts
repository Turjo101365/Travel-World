export interface TourDestination {
  id: number;
  slug: string;
  title: string;
  country: string;
  city: string;
  locationLabel: string;
  image: string;
  shortDescription: string;
  description: string;
  duration: string;
  price: string;
  rating: number;
  guideLocation: string;
  highlights: string[];
}

export const tourDestinations: TourDestination[] = [
  {
    id: 1,
    slug: 'paris-france',
    title: 'Paris Highlights',
    country: 'France',
    city: 'Paris',
    locationLabel: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Art, architecture, and elegant city walks through Europe’s most iconic capital.',
    description:
      'Paris is perfect for travelers who want a blend of timeless landmarks, riverside charm, boutique streets, and unforgettable food. From the Eiffel Tower to the Louvre, every corner offers a story, and a local guide helps you explore the city beyond the tourist checklist.',
    duration: '5 Days',
    price: '$1,899',
    rating: 4.9,
    guideLocation: 'Paris',
    highlights: ['Eiffel Tower & Seine Cruise', 'Louvre and museum district', 'Cafe culture and local food spots'],
  },
  {
    id: 2,
    slug: 'tokyo-japan',
    title: 'Tokyo Adventure',
    country: 'Japan',
    city: 'Tokyo',
    locationLabel: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'A fast-moving city of neon streets, deep tradition, and unforgettable food experiences.',
    description:
      'Tokyo gives travelers the best of both worlds: vibrant modern districts and quiet cultural spaces. A destination-focused local guide can help visitors navigate neighborhoods, discover authentic cuisine, and build a smooth itinerary across temples, markets, and skyline views.',
    duration: '6 Days',
    price: '$2,249',
    rating: 4.8,
    guideLocation: 'Tokyo',
    highlights: ['Shibuya and skyline spots', 'Temple and cultural districts', 'Street food and hidden local favorites'],
  },
  {
    id: 3,
    slug: 'cape-town-south-africa',
    title: 'Cape Town Escape',
    country: 'South Africa',
    city: 'Cape Town',
    locationLabel: 'Cape Town, South Africa',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Mountain views, coastal drives, wildlife, and outdoor adventure in one destination.',
    description:
      'Cape Town is ideal for travelers who love nature, scenic routes, and open-air experiences. With the right guide, visitors can combine iconic viewpoints, marine adventures, and cultural stops into one balanced tour that feels exciting and locally grounded.',
    duration: '7 Days',
    price: '$1,749',
    rating: 4.9,
    guideLocation: 'Cape Town',
    highlights: ['Table Mountain and coastline views', 'Safari and nature activity planning', 'Local culture and waterfront experiences'],
  },
  {
    id: 4,
    slug: 'mexico-city-mexico',
    title: 'Mexico City Heritage',
    country: 'Mexico',
    city: 'Mexico City',
    locationLabel: 'Mexico City, Mexico',
    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Historic landmarks, colorful streets, bold flavors, and rich culture at every step.',
    description:
      'Mexico City offers an energetic mix of history, art, and street life. A local tour guide makes it easier for travelers to move confidently through museums, plazas, food markets, and heritage sites while understanding the stories that shape the city.',
    duration: '5 Days',
    price: '$1,629',
    rating: 4.8,
    guideLocation: 'Mexico City',
    highlights: ['Historic center and city squares', 'Museum and culture route', 'Traditional food market experiences'],
  },
  {
    id: 5,
    slug: 'dubai-uae',
    title: 'Dubai Luxury',
    country: 'UAE',
    city: 'Dubai',
    locationLabel: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Modern landmarks, desert experiences, shopping, and premium hospitality in one trip.',
    description:
      'Dubai is a destination for travelers who want polished city experiences with a sense of scale and luxury. With a destination-matched guide, visitors can explore famous towers, cultural neighborhoods, and desert activities while keeping the trip comfortable and efficient.',
    duration: '4 Days',
    price: '$2,099',
    rating: 4.9,
    guideLocation: 'Dubai',
    highlights: ['Burj Khalifa and downtown sights', 'Desert safari planning', 'Luxury shopping and evening experiences'],
  },
];

export const getDestinationBySlug = (slug?: string) =>
  tourDestinations.find((destination) => destination.slug === slug);
