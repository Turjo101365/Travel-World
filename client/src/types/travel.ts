export interface TourGuideSummary {
  id: number;
  destination_id?: number | null;
  name: string;
  photo: string;
  description: string;
  rating: number;
  location: string;
  experience_years: number;
  languages: string;
  hire_cost?: number;
  phone?: string;
  email?: string;
}

export interface TourDestinationSummary {
  id: number;
  slug: string;
  title: string;
  country: string;
  city: string;
  location_label: string;
  image: string;
  short_description: string;
  description: string;
  duration: string;
  price: string;
  rating: number;
  guides_count?: number;
  guides?: TourGuideSummary[];
}
