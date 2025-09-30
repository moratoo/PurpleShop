import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';

export function Privacy() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('legal.privacy.title')}</h1>
        
        <div className="prose prose-purple max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.privacy.introduction.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.privacy.introduction.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.privacy.collection.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.privacy.collection.content')}
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
              <li>{t('legal.privacy.collection.items.1')}</li>
              <li>{t('legal.privacy.collection.items.2')}</li>
              <li>{t('legal.privacy.collection.items.3')}</li>
              <li>{t('legal.privacy.collection.items.4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.privacy.usage.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.privacy.usage.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.privacy.sharing.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.privacy.sharing.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.privacy.rights.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.privacy.rights.content')}
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