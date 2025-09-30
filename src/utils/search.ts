import { Product, Categories, Location, SearchFilters } from '../types';

/**
 * Search products by title and filter by various criteria
 */
export function searchProducts(
  products: Product[],
  searchQuery: string = '',
  filters?: SearchFilters
): Product[] {
  let filteredProducts = [...products];

  // Text search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(query)
    );
  }

  // Location filter
  if (filters?.location) {
    filteredProducts = filteredProducts.filter(product =>
      product.location === filters.location
    );
  }

  // Price range filter
  if (filters?.priceRange) {
    filteredProducts = filteredProducts.filter(product => {
      if (!product.price) return false;

      const { min, max } = filters.priceRange!;
      if (min !== undefined && product.price < min) return false;
      if (max !== undefined && product.price > max) return false;

      return true;
    });
  }

  return filteredProducts;
}

/**
 * Get all products from categories object
 */
export function getAllProducts(categories: Categories): Product[] {
  const allProducts: Product[] = [];

  // Free products
  Object.values(categories.free).forEach(category => {
    allProducts.push(...category.items);
  });

  // Second hand products
  Object.values(categories.secondHand).forEach(category => {
    allProducts.push(...category.items);
  });

  // New products
  Object.values(categories.new).forEach(category => {
    allProducts.push(...category.items);
  });

  return allProducts;
}

/**
 * Filter products by category type (free, secondHand, new)
 */
export function filterProductsByType(
  categories: Categories,
  type: 'free' | 'secondHand' | 'new'
): Product[] {
  const typeCategories = categories[type];
  const products: Product[] = [];

  Object.values(typeCategories).forEach(category => {
    products.push(...category.items);
  });

  return products;
}

/**
 * Get unique locations from products
 */
export function getAvailableLocations(products: Product[]): Location[] {
  const locations = new Set(products.map(product => product.location));
  return Array.from(locations).sort() as Location[];
}

/**
 * Get price range from products
 */
export function getPriceRange(products: Product[]): { min: number; max: number } | null {
  const pricedProducts = products.filter(product => product.price !== undefined);

  if (pricedProducts.length === 0) return null;

  const prices = pricedProducts.map(product => product.price!);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

/**
 * Search and filter across all categories while maintaining category structure
 */
export function searchAllCategories(
  categories: Categories,
  searchQuery: string = '',
  filters?: SearchFilters
): Categories {
  const filteredCategories: Categories = {
    free: {},
    secondHand: {},
    new: {}
  };

  // Filter free categories
  Object.entries(categories.free).forEach(([key, category]) => {
    const filteredProducts = searchProducts(category.items, searchQuery, filters);
    if (filteredProducts.length > 0) {
      filteredCategories.free[key] = {
        ...category,
        items: filteredProducts
      };
    }
  });

  // Filter secondHand categories
  Object.entries(categories.secondHand).forEach(([key, category]) => {
    const filteredProducts = searchProducts(category.items, searchQuery, filters);
    if (filteredProducts.length > 0) {
      filteredCategories.secondHand[key] = {
        ...category,
        items: filteredProducts
      };
    }
  });

  // Filter new categories
  Object.entries(categories.new).forEach(([key, category]) => {
    const filteredProducts = searchProducts(category.items, searchQuery, filters);
    if (filteredProducts.length > 0) {
      filteredCategories.new[key] = {
        ...category,
        items: filteredProducts
      };
    }
  });

  return filteredCategories;
}