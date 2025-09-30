import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';

export function Terms() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('legal.terms.title')}</h1>
        
        <div className="prose prose-purple max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.terms.introduction.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.terms.introduction.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.terms.usage.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.terms.usage.content')}
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
              <li>{t('legal.terms.usage.rules.1')}</li>
              <li>{t('legal.terms.usage.rules.2')}</li>
              <li>{t('legal.terms.usage.rules.3')}</li>
              <li>{t('legal.terms.usage.rules.4')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.terms.account.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.terms.account.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.terms.liability.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.terms.liability.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('legal.terms.changes.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('legal.terms.changes.content')}
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