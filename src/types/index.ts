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
  gastronomy?: Array<{ name: string; image: string; ingredients: string }>;
  tips?: string[];
  expeditionGear?: string[];
  recommendations?: number;
  likes?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface PostComment {
  id: string;
  postId: string;
  userName: string;
  content: string;
  likes?: number;
  createdAt: number;
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

// --- Global Content Registry (CMS) Types ---

export interface HomeContent {
  heroTitle: string;
  heroDescription: string;
  coordinates: string;
  altitude: string;
  label: string;
}

export interface AboutContent {
  title: string;
  description: string;
  subjectId: string;
  phases: Array<{ title: string; content: string }>;
  metrics: Array<{ label: string; val: string; desc: string; icon: string; theme?: 'dark' }>;
  faqs: Array<{ q: string; a: string; ref: string }>;
}

export interface GearItem {
  id: string;
  name: string;
  category: string;
  ref: string;
  val1: string;
  label1: string;
  val2: string;
  label2: string;
  img: string;
  icon: string;
}

export interface GearContent {
  title: string;
  description: string;
  items: GearItem[];
  featured: {
    title: string;
    description: string;
    img: string;
    specs: Array<{ l: string; v: string }>;
  };
}

export interface GastronomyDish {
  id: string;
  region: string;
  country: string;
  title: string;
  img: string;
  cols: string;
  aspect: string;
  bgHover: string;
}

export interface GastronomyContent {
  heroTitle: string;
  heroDescription: string;
  dishes: GastronomyDish[];
  spotlight: {
    title: string;
    details: Array<{ label: string; val: string }>;
    recommended: Array<{ name: string; city: string; rate: string }>;
    img: string;
    saturation: string;
  };
}

export interface LogisticsContent {
  heroTitle: string;
  heroDescription: string;
  latency: string;
  uptime: string;
  resources: Array<{ title: string; desc: string; icon: string; stat: string }>;
  infrastructure: {
    uplink: string;
    localGrid: string;
    timezones: Array<{ city: string; utc: string; active: boolean }>;
  };
}

export type SectorId = 'home' | 'about' | 'gear' | 'gastronomy' | 'logistics';

export interface SectorContentMap {
  home: HomeContent;
  about: AboutContent;
  gear: GearContent;
  gastronomy: GastronomyContent;
  logistics: LogisticsContent;
}

export interface SiteSectorDoc {
  id: SectorId;
  published: SectorContentMap[SectorId];
  draft: SectorContentMap[SectorId];
  updatedAt: number;
}
