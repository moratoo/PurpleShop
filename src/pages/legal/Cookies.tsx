import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';

export function Cookies() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <a href="/" className="flex items-center space-x-2 text-white hover:text-purple-200">
            <ShoppingBag className="h-8 w-8" />
            <span className="text-2xl font-bold">PurpleShop</span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('legal.cookies.title')}</h1>
        
        <div className="prose prose-purple max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.cookies.introduction.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.cookies.introduction.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.cookies.types.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800">{t('legal.cookies.types.essential.title')}</h3>
                <p className="text-gray-600">{t('legal.cookies.types.essential.content')}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">{t('legal.cookies.types.analytics.title')}</h3>
                <p className="text-gray-600">{t('legal.cookies.types.analytics.content')}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800">{t('legal.cookies.types.marketing.title')}</h3>
                <p className="text-gray-600">{t('legal.cookies.types.marketing.content')}</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.cookies.control.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.cookies.control.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.cookies.updates.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.cookies.updates.content')}
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-400">{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}