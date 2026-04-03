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
  currentSeasonDate?: string;  // e.g. "April 5, 2026"
  nowPlaying?: boolean;        // true if new season aired in 2026
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
