import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, ShoppingBag, Heart, Loader2, AlertCircle } from 'lucide-react';
import { LanguageSelector } from './components/LanguageSelector';
import { AuthModal } from './components/AuthModal';
import { About } from './pages/company/About';
import { SocialImpact } from './pages/company/SocialImpact';
import { Careers } from './pages/company/Careers';
import { Press } from './pages/company/Press';
import { Terms } from './pages/legal/Terms';
import { Privacy } from './pages/legal/Privacy';
import { Cookies } from './pages/legal/Cookies';
import { Legal } from './pages/legal/Legal';
import { SearchFilters as SearchFiltersComponent } from './components/SearchFilters';
import { ProductDetail } from './pages/ProductDetail';
import {
  Categories,
  CategorySection,
  Location,
  HomePageProps,
  PageType,
  LocationEmojis,
  SearchFilters,
  Product
} from './types';
import { searchAllCategories, getAllProducts, getAvailableLocations } from './utils/search';
import { useProducts, useFavorites, useAuth, useCategories } from './hooks/useApi';
import { apiService } from './services/api';

const locationEmojis: LocationEmojis = {
  'Madrid': '🇪🇸',
  'Barcelona': '🇪🇸',
  'Valencia': '🇪🇸',
  'Sevilla': '🇪🇸'
};

function HomePage({ categories, renderSubcategoryProducts, searchQuery, setSearchQuery }: HomePageProps) {
  const { t } = useTranslation();
  
  return (
    <>
      <main className="w-full flex-grow">
        <div className="max-w-[2000px] mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('categories.free.title')}</h2>
            {renderSubcategoryProducts(categories.free)}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('categories.secondHand.title')}</h2>
            {renderSubcategoryProducts(categories.secondHand, true)}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('categories.new.title')}</h2>
            {renderSubcategoryProducts(categories.new, true)}
          </section>
        </div>
      </main>
    </>
  );
}

function App() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    location: undefined,
    priceRange: undefined,
    condition: undefined
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // API Hooks
  const { isAuthenticated, user, login, logout } = useAuth();
  const { favorites, toggleFavorite: apiToggleFavorite, isFavorite: apiIsFavorite } = useFavorites();
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useCategories();

  // Add loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  // Test API connection on component mount
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        await apiService.healthCheck();
        setApiConnected(true);
      } catch (error) {
        console.warn('Backend API not available, using mock data');
        setApiConnected(false);
      }
    };

    testConnection();
  }, []);

  // Use mock data for now (will be replaced with real API calls)
  const categories: Categories = {
    free: {
      technology: {
        emoji: '💻',
        title: 'Tecnología',
        items: [
          { id: '1', title: 'Monitor LCD', image: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c', location: 'Madrid' as Location },
          { id: '2', title: 'Teclado Mecánico', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', location: 'Barcelona' as Location },
          { id: '3', title: 'Mouse Gaming', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', location: 'Valencia' as Location },
          { id: '4', title: 'Webcam HD', image: 'https://images.unsplash.com/photo-1587826080692-f560d8f3f213', location: 'Sevilla' as Location }
        ]
      },
      home: {
        emoji: '🏠',
        title: 'Hogar',
        items: [
          { id: '5', title: 'Lámpara de Mesa', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', location: 'Madrid' as Location },
          { id: '6', title: 'Cojines', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6', location: 'Barcelona' as Location },
          { id: '7', title: 'Espejo Decorativo', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013', location: 'Valencia' as Location },
          { id: '8', title: 'Maceta', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411', location: 'Sevilla' as Location }
        ]
      },
      books: {
        emoji: '📚',
        title: 'Libros',
        items: [
          { id: '25', title: 'Novela Histórica', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', location: 'Madrid' as Location },
          { id: '26', title: 'Libros Cocina', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646', location: 'Barcelona' as Location },
          { id: '27', title: 'Comics Manga', image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06', location: 'Valencia' as Location },
          { id: '28', title: 'Libros Técnicos', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8', location: 'Sevilla' as Location }
        ]
      }
    },
    secondHand: {
      electronics: {
        emoji: '📱',
        title: 'Electrónicos',
        items: [
          { id: '9', title: 'iPhone 12', image: 'https://images.unsplash.com/photo-1605637064671-c03a5fae76cd', location: 'Madrid' as Location, price: 399 },
          { id: '10', title: 'Samsung TV', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1', location: 'Barcelona' as Location, price: 299 },
          { id: '11', title: 'iPad Pro', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', location: 'Valencia' as Location, price: 449 },
          { id: '12', title: 'MacBook Air', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9', location: 'Sevilla' as Location, price: 699 }
        ]
      },
      furniture: {
        emoji: '🪑',
        title: 'Muebles',
        items: [
          { id: '13', title: 'Sofá', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', location: 'Madrid' as Location, price: 299 },
          { id: '14', title: 'Mesa Comedor', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7', location: 'Barcelona' as Location, price: 199 },
          { id: '15', title: 'Silla Oficina', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1', location: 'Valencia' as Location, price: 89 },
          { id: '16', title: 'Estantería', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156', location: 'Sevilla' as Location, price: 129 }
        ]
      },
      sports: {
        emoji: '⚽',
        title: 'Deportes',
        items: [
          { id: '29', title: 'Bicicleta MTB', image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91', location: 'Madrid' as Location, price: 245 },
          { id: '30', title: 'Raqueta Tenis', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0', location: 'Barcelona' as Location, price: 49 },
          { id: '31', title: 'Tabla Surf', image: 'https://images.unsplash.com/photo-1531722569936-825d3dd91b15', location: 'Valencia' as Location, price: 180 },
          { id: '32', title: 'Patines', image: 'https://images.unsplash.com/photo-1600188769730-3df7f8b8bc01', location: 'Sevilla' as Location, price: 75 }
        ]
      }
    },
    new: {
      clothing: {
        emoji: '👕',
        title: 'Ropa',
        items: [
          { id: '17', title: 'Chaqueta', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', location: 'Madrid' as Location, price: 79 },
          { id: '18', title: 'Zapatillas', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', location: 'Barcelona' as Location, price: 99 },
          { id: '19', title: 'Jeans', image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09', location: 'Valencia' as Location, price: 59 },
          { id: '20', title: 'Camiseta', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', location: 'Sevilla' as Location, price: 29 }
        ]
      },
      appliances: {
        emoji: '🔌',
        title: 'Electrodomésticos',
        items: [
          { id: '21', title: 'Nevera', image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5', location: 'Madrid' as Location, price: 899 },
          { id: '22', title: 'Lavadora', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfbed00', location: 'Barcelona' as Location, price: 599 },
          { id: '23', title: 'Microondas', image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d', location: 'Valencia' as Location, price: 129 },
          { id: '24', title: 'Cafetera', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6', location: 'Sevilla' as Location, price: 89 }
        ]
      },
      gaming: {
        emoji: '🎮',
        title: 'Gaming',
        items: [
          { id: '33', title: 'PS5', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db', location: 'Madrid' as Location, price: 499 },
          { id: '34', title: 'Nintendo Switch', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e', location: 'Barcelona' as Location, price: 299 },
          { id: '35', title: 'Xbox Series X', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d', location: 'Valencia' as Location, price: 499 },
          { id: '36', title: 'Gaming PC', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7', location: 'Sevilla' as Location, price: 1299 }
        ]
      }
    }
  };

  // Update search filters when search query changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSearchFilters(prev => ({ ...prev, query }));
  };

  // Filtered categories based on search and filters
  const filteredCategories = useMemo(() => {
    return searchAllCategories(categories, searchQuery, searchFilters);
  }, [categories, searchQuery, searchFilters]);

  // Available locations for filter options
  const availableLocations = useMemo(() => {
    // If API is connected, use API data, otherwise use mock data
    if (apiConnected && categoriesData?.locations) {
      return categoriesData.locations as Location[];
    }
    // Fallback to mock data
    return getAvailableLocations(getAllProducts(categories));
  }, [categories, categoriesData, apiConnected]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
  };

  // Navigation functions
  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  // Find product by ID from original categories (for navigation from filtered results)
  const findProductById = (productId: string): Product | null => {
    const allProducts = getAllProducts(categories);
    return allProducts.find(product => product.id === productId) || null;
  };

  const navigateBack = () => {
    setSelectedProduct(null);
    setCurrentPage('home');
  };

  // Favorite functions - using API
  const toggleFavorite = async (productId: string) => {
    try {
      const numericId = parseInt(productId);
      await apiToggleFavorite(numericId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (productId: string): boolean => {
    const numericId = parseInt(productId);
    return apiIsFavorite(numericId);
  };

  const renderSubcategoryProducts = (products: CategorySection, showPrice = false) => {
    return Object.entries(products).map(([key, category]) => (
      <div key={key} className="mb-6">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2">{category.emoji}</span>
            {category.title}
          </h3>
          <a href="#" className="text-purple-600 hover:text-purple-700 text-sm">Ver más →</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
          {category.items.map((product) => (
            <div
              key={product.id}
              onClick={() => navigateToProduct(product)}
              className="bg-white rounded shadow-sm hover:shadow-md transition cursor-pointer relative"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full aspect-square object-cover rounded-t"
              />
              {isFavorite(product.id) && (
                <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                  <Heart className="h-4 w-4 fill-current" />
                </div>
              )}
              <div className="p-2">
                <h4 className="font-medium text-sm truncate">{product.title}</h4>
                <p className="text-xs text-gray-600 flex items-center">
                  <MapPin className="h-3 w-3 mr-0.5" />
                  <span>{locationEmojis[product.location]} {product.location}</span>
                </p>
                {showPrice && product.price && (
                  <span className="text-purple-600 font-bold text-sm mt-1 block">
                    {product.price}€
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );

  // Error component
  const ErrorMessage = ({ error }: { error: string }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
        <p className="text-gray-600 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  const renderPage = () => {
    // Show loading state if needed
    if (loading) {
      return <LoadingSpinner />;
    }

    // Show error state if needed
    if (error) {
      return <ErrorMessage error={error} />;
    }

    switch (currentPage) {
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={navigateBack}
            onFavorite={toggleFavorite}
            isFavorite={isFavorite(selectedProduct.id)}
          />
        ) : (
          <div>Product not found</div>
        );
      case 'about':
        return <About />;
      case 'social-impact':
        return <SocialImpact />;
      case 'careers':
        return <Careers />;
      case 'press':
        return <Press />;
      case 'terms':
        return <Terms />;
      case 'privacy':
        return <Privacy />;
      case 'cookies':
        return <Cookies />;
      case 'legal':
        return <Legal />;
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              onLogin={login}
              isAuthenticated={isAuthenticated}
              user={user}
            />
            
            <header className="bg-purple-600 text-white w-full">
              <div className="max-w-[2000px] mx-auto px-4">
                <div className="py-4 border-b border-purple-500">
                  <nav className="flex justify-between items-center">
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
                      className="flex items-center space-x-2 text-white hover:text-purple-200"
                    >
                      <ShoppingBag className="h-8 w-8" />
                      <span className="text-2xl font-bold">PurpleShop</span>
                    </a>
                    
                    <div className="flex items-center space-x-8">
                      <div className="flex space-x-6">
                        <a href="#" className="hover:text-purple-200 flex items-center space-x-1">
                          {t('nav.explore')}
                        </a>
                        <a href="#" className="hover:text-purple-200 flex items-center space-x-1">
                          {t('nav.sell')}
                        </a>
                        <a href="#" className="hover:text-purple-200 flex items-center space-x-1">
                          {t('nav.free')}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <LanguageSelector />

                        {/* API Connection Status */}
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            apiConnected === true ? 'bg-green-500' :
                            apiConnected === false ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-xs text-white opacity-75">
                            {apiConnected === true ? 'API OK' :
                             apiConnected === false ? 'Mock' : 'Checking'}
                          </span>
                        </div>

                        <button
                          onClick={() => setIsAuthModalOpen(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          {isAuthenticated ? (user?.display_name || t('nav.profile')) : t('nav.createAccount')}
                        </button>
                      </div>
                    </div>
                  </nav>
                </div>

                <div className="py-16 text-center">
                  <h1 className="text-5xl font-bold mb-4">PurpleShop</h1>
                  <p className="text-2xl mb-8">El ciclo continúa</p>
                  
                  <div className="max-w-3xl mx-auto">
                    <input
                      type="text"
                      placeholder={t('hero.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300 text-lg"
                    />
                  </div>
                </div>
              </div>
            </header>

            <SearchFiltersComponent
              filters={searchFilters}
              onFiltersChange={handleFiltersChange}
              availableLocations={availableLocations}
              apiConnected={apiConnected}
            />

            <HomePage
              categories={filteredCategories}
              renderSubcategoryProducts={renderSubcategoryProducts}
              searchQuery={searchQuery}
              setSearchQuery={handleSearchChange}
            />

            <footer className="bg-gray-800 text-white w-full">
              <div className="max-w-[2000px] mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">{t('footer.company.title')}</h3>
                    <ul className="space-y-2">
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}
                          className="text-gray-300 hover:text-white"
                        >
                          {t('footer.company.about')}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage('careers'); }}
                          className="text-gray-300 hover:text-white"
                        >
                          {t('footer.company.careers')}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage('press'); }}
                          className="text-gray-300 hover:text-white"
                        >
                          {t('footer.company.press')}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage('social-impact'); }}
                          className="text-gray-300 hover:text-white"
                        >
                          {t('footer.company.impact')}
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-300 hover:text-white">
                          {t('footer.company.sustainability')}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('footer.support.title')}</h3>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.support.help')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.support.contact')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.support.safety')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.support.report')}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('footer.buyers.title')}</h3>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.buyers.how')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.buyers.safety')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.buyers.protection')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.buyers.app')}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('footer.sellers.title')}</h3>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.sellers.how')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.sellers.rules')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.sellers.fees')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.sellers.pro')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.sellers.app')}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('footer.payments.title')}</h3>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.payments.cards')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.payments.paypal')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.payments.transfer')}</a></li>
                      <li><a href="#" className="text-gray-300 hover:text-white">{t('footer.payments.security')}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('footer.legal.title')}</h3>
                    <ul className="space-y-2">
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage('terms'); }}
                          className="text-gray-300 hover:text-white"
                        >
                          {t('footer.legal.terms')}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage('privacy'); }}
                          className="text-gray-300 hover:text-white"
                        >
                          {t('footer.legal.privacy')}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage('cookies'); }}
                          className="text-gray-300 hover:text-white"
                        >
                          {t('footer.legal.cookies')}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage('legal'); }}
                          className="text-gray-300 hover:text-white"
                        >
                          {t('footer.legal.legal')}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center items-center mt-12 mb-8">
                  <div className="flex items-center space-x-3 text-gray-500 opacity-30">
                    <ShoppingBag className="h-12 w-12" />
                    <span className="text-4xl font-bold">PurpleShop</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">{t('footer.address')}</p>
                  <p className="text-gray-400 text-sm mt-2">{t('footer.copyright')}</p>
                </div>
              </div>
            </footer>
          </div>
        );
    }
  };

  return renderPage();
}

export default App;