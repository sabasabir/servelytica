
export interface Achievement {
  year: string;
  title: string;
  description: string;
}

export interface Coach {
  id: number;
  name: string;
  username: string;
  image: string;
  title: string;
  rating: number;
  reviews: number;
  responseTime: string;
  specialties: string[];
  experience: string;
  category: string;
  achievements: Achievement[];
}
