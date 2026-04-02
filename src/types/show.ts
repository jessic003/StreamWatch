export type Platform = 'netflix' | 'hulu' | 'apple' | 'prime';

export interface Show {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  genre: string;
  rating: number;
  isNew: boolean;
  image: string;
  year: number;
  episodes: number;
  seasons: number;
}

export interface ComingSoonShow {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  genre: string;
  image: string;
  releaseDate: string;
}
