export type PostStatus = 'live' | 'draft' | 'archive';
export type DestinationStatus = 'active' | 'visited' | 'archive';
export type DestinationCategory = 'CHRONICLE' | 'RETREAT' | 'ASTRO' | 'CULTURE' | 'WILDERNESS' | 'EXPEDITION';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  status: PostStatus;
  imageUrl: string;
  coordinates?: string;
  gear?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Destination {
  id: string;
  title: string;
  location: string;
  category: DestinationCategory;
  status: DestinationStatus;
  imageUrl: string;
  longitude: number;
  latitude: number;
  excerpt?: string;
  createdAt?: number;
  updatedAt?: number;
}

// Omit id since Firestore generates it
export type PostInput = Omit<Post, 'id'>;
export type DestinationInput = Omit<Destination, 'id'>;
