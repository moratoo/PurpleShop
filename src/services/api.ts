/**
 * API service layer for PurpleShop frontend
 * Handles communication with FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Types for API responses
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Product {
  id: number;
  title: string;
  description?: string;
  price?: number;
  category: string;
  subcategory?: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  product_type: 'free' | 'second_hand' | 'new';
  location: string;
  latitude?: number;
  longitude?: number;
  image_urls?: string[];
  main_image_url?: string;
  status: 'active' | 'inactive' | 'sold' | 'deleted' | 'pending';
  is_featured: boolean;
  views_count: number;
  favorites_count: number;
  inquiries_count: number;
  seller?: {
    id: number;
    display_name?: string;
    avatar_url?: string;
    location?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  condition?: string;
  product_type?: string;
  status?: string;
  seller_id?: number;
  latitude?: number;
  longitude?: number;
  radius_km?: number;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  is_verified: boolean;
  products_count: number;
  favorites_count: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  location?: string;
  accept_terms: boolean;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // Load token from localStorage if available
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.token = token;
    }
  }

  private saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.token = token;
  }

  private removeToken(): void {
    localStorage.removeItem('auth_token');
    this.token = null;
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(includeAuth),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401 && includeAuth) {
          // Token might be expired, remove it
          this.removeToken();
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<{ user: User; access_token: AuthTokens }> {
    const response = await this.request<{ user: User; access_token: AuthTokens }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      false // Don't include auth for login
    );

    if (response.access_token?.access_token) {
      this.saveToken(response.access_token.access_token);
    }

    return response;
  }

  async register(userData: RegisterData): Promise<{ user: User; access_token: AuthTokens }> {
    const response = await this.request<{ user: User; access_token: AuthTokens }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      false // Don't include auth for register
    );

    if (response.access_token?.access_token) {
      this.saveToken(response.access_token.access_token);
    }

    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.removeToken();
  }

  // Product methods
  async getProducts(
    filters?: ProductFilters,
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...Object.fromEntries(
        Object.entries(filters || {}).filter(([_, v]) => v !== undefined && v !== null)
      ),
    });

    return this.request<PaginatedResponse<Product>>(`/products?${params}`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'seller'>): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request(`/products/${id}`, { method: 'DELETE' });
  }

  async favoriteProduct(productId: number): Promise<void> {
    await this.request(`/products/${productId}/favorite`, { method: 'POST' });
  }

  async unfavoriteProduct(productId: number): Promise<void> {
    await this.request(`/products/${productId}/favorite`, { method: 'DELETE' });
  }

  // Category methods
  async getCategories(): Promise<{ categories: string[]; locations: string[] }> {
    return this.request('/categories/list');
  }

  async getCategoryDetails(categoryName: string): Promise<any> {
    return this.request(`/categories/${categoryName}`);
  }

  // User methods
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async getUserProducts(userId: number, page: number = 1, size: number = 20): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.request<PaginatedResponse<Product>>(`/users/${userId}/products?${params}`);
  }

  async getUserFavorites(userId: number, page: number = 1, size: number = 20): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.request<PaginatedResponse<Product>>(`/users/${userId}/favorites?${params}`);
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Search methods
  async searchProducts(query: string, filters?: ProductFilters): Promise<Product[]> {
    const searchParams = { search: query, ...filters };
    const response = await this.getProducts(searchParams, 1, 50); // Get more results for search
    return response.items;
  }

  // Statistics
  async getProductsStats(): Promise<any> {
    return this.request('/products/stats/summary');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    return this.request('/health', {}, false);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create and export API service instance
export const apiService = new ApiService();