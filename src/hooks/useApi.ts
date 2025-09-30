/**
 * Custom React hooks for API operations
 */
import { useState, useEffect, useCallback } from 'react';
import { apiService, Product, ProductFilters, User } from '../services/api';

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for products list
export function useProducts(
  filters?: ProductFilters,
  page: number = 1,
  size: number = 20
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProducts(filters, page, size);
      setProducts(response.items);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, size]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    total,
    loading,
    error,
    refetch: fetchProducts,
    hasMore: products.length < total
  };
}

// Hook for single product
export function useProduct(productId: number | null) {
  return useApi(
    () => productId ? apiService.getProduct(productId) : Promise.resolve(null),
    [productId]
  );
}

// Hook for current user
export function useCurrentUser() {
  return useApi(
    () => apiService.getCurrentUser(),
    [] // Empty dependency array since user data doesn't change often
  );
}

// Hook for user products
export function useUserProducts(userId: number, page: number = 1, size: number = 20) {
  return useApi(
    () => apiService.getUserProducts(userId, page, size),
    [userId, page, size]
  );
}

// Hook for categories
export function useCategories() {
  return useApi(
    () => apiService.getCategories(),
    []
  );
}

// Hook for search
export function useSearch(query: string, filters?: ProductFilters) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string, searchFilters?: ProductFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await apiService.searchProducts(searchQuery, searchFilters);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(query, filters);
  }, [query, filters, search]);

  return { results, loading, error, search };
}

// Hook for authentication
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(apiService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.login({ email, password });
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token might be invalid, remove it
          apiService['removeToken']();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };
}

// Hook for favorites
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggleFavorite = useCallback(async (productId: number) => {
    try {
      setLoading(true);

      if (favorites.has(productId)) {
        await apiService.unfavoriteProduct(productId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await apiService.favoriteProduct(productId);
        setFavorites(prev => new Set(prev).add(productId));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  const isFavorite = useCallback((productId: number) => {
    return favorites.has(productId);
  }, [favorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite
  };
}