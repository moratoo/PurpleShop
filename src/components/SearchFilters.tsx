import React from 'react';
import { useTranslation } from 'react-i18next';
import { Location, SearchFilters as SearchFiltersType } from '../types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  availableLocations: Location[];
  apiConnected?: boolean | null;
}

export function SearchFilters({ filters, onFiltersChange, availableLocations, apiConnected }: SearchFiltersProps) {
  const { t } = useTranslation();

  const handleLocationChange = (location: Location | '') => {
    onFiltersChange({
      ...filters,
      location: location || undefined
    });
  };

  const handleConditionChange = (condition: 'free' | 'secondHand' | 'new' | '') => {
    onFiltersChange({
      ...filters,
      condition: condition || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: filters.query,
      location: undefined,
      priceRange: undefined,
      condition: undefined
    });
  };

  const hasActiveFilters = filters.location || filters.condition || filters.priceRange;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      {/* API Connection Status */}
      {apiConnected !== null && (
        <div className="mb-4 p-2 rounded-lg bg-gray-50 border">
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              apiConnected ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <span>
              {apiConnected
                ? '✅ Conectado al backend API'
                : '⚠️ Usando datos locales (API no disponible)'}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center">
        {/* Location Filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.location')}
          </label>
          <select
            id="location-filter"
            value={filters.location || ''}
            onChange={(e) => handleLocationChange(e.target.value as Location | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">{t('filters.allLocations')}</option>
            {availableLocations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="condition-filter" className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.condition')}
          </label>
          <select
            id="condition-filter"
            value={filters.condition || ''}
            onChange={(e) => handleConditionChange(e.target.value as 'free' | 'secondHand' | 'new' | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">{t('filters.allConditions')}</option>
            <option value="free">{t('categories.free.title')}</option>
            <option value="secondHand">{t('categories.secondHand.title')}</option>
            <option value="new">{t('categories.new.title')}</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
            >
              {t('filters.clear')}
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.location && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                📍 {filters.location}
                <button
                  onClick={() => handleLocationChange('')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.condition && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                🏷️ {t(`categories.${filters.condition}.title`)}
                <button
                  onClick={() => handleConditionChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}