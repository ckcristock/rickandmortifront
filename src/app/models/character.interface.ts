export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: Location;
  location: Location;
  image: string;
  episode?: string[]; // URLs de episodios (API pública)
  episodes?: Episode[]; // Episodios completos (Backend .NET)
  url?: string;
  created?: string;
}

export interface Location {
  name: string;
  url: string;
}

export interface CharacterResponse {
  info: Info;
  results: Character[];
}

export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface Episode {
  id: number;
  name: string;
  airDate: string; // Cambio de air_date a airDate (camelCase)
  episode: string;
  characters?: string[];
  url?: string;
  created?: string;
}
