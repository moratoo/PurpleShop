// Core product and category types
export interface Product {
  id: string;
  title: string;
  image: string;
  location: string;
  price?: number;
}

export interface Category {
  emoji: string;
  title: string;
  items: Product[];
}

export interface CategorySection {
  [key: string]: Category;
}

export interface Categories {
  free: CategorySection;
  secondHand: CategorySection;
  new: CategorySection;
}

// Location and UI types
export type Location = 'Madrid' | 'Barcelona' | 'Valencia' | 'Sevilla';

export interface LocationEmojis {
  [key: string]: string;
}

// Component prop types
export interface HomePageProps {
  categories: Categories;
  renderSubcategoryProducts: (products: CategorySection, showPrice?: boolean) => JSX.Element[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Navigation and page types
export type PageType =
  | 'home'
  | 'product-detail'
  | 'about'
  | 'social-impact'
  | 'careers'
  | 'press'
  | 'terms'
  | 'privacy'
  | 'cookies'
  | 'legal';

// Authentication types
export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Search and filter types
export interface SearchFilters {
  query: string;
  category?: string;
  location?: Location;
  priceRange?: {
    min?: number;
    max?: number;
  };
  condition?: 'free' | 'secondHand' | 'new';
}

// API response types (for future backend integration)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types (for future authentication)
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  location?: Location;
  joinedAt: Date;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location?: Location;
}