import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Heart, Share2, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export function ProductDetail({ product, onBack, onFavorite, isFavorite = false }: ProductDetailProps) {
  const { t } = useTranslation();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-[2000px] mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t('common.back')}</span>
          </button>
        </div>
      </header>

      <div className="max-w-[2000px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 lg:h-[600px] object-cover"
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
                <span>•</span>
                <span>{t('product.id')}: {product.id}</span>
              </div>
            </div>

            {/* Price Section */}
            {product.price && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">
                  {product.price}€
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {t('product.price')}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {onFavorite && (
                <button
                  onClick={() => onFavorite(product.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>
                    {isFavorite ? t('product.removeFavorite') : t('product.addFavorite')}
                  </span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>{t('product.share')}</span>
              </button>

              <button className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>{t('product.contactSeller')}</span>
              </button>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">{t('product.details')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('product.category')}:</span>
                  <span className="font-medium">{t('product.general')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('product.condition')}:</span>
                  <span className="font-medium">{t('product.used')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('product.location')}:</span>
                  <span className="font-medium">{product.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('product.dateAdded')}:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">{t('product.description')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('product.descriptionText', {
                  title: product.title,
                  location: product.location
                })}
              </p>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">{t('product.sellerInfo')}</h3>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">U</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{t('product.sellerName')}</div>
                  <div className="text-sm text-gray-600">{t('product.memberSince')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}