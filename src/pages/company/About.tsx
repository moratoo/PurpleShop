import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';

export function About() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('about.title')}</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('about.beginnings.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('about.beginnings.content')}
            </p>
          </section>

          <div className="relative h-80 rounded-xl overflow-hidden my-12">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" 
              alt="PurpleShop Team" 
              className="w-full h-full object-cover"
            />
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('about.mission.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('about.mission.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('about.values.title')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-purple-600 mb-2">{t('about.values.sustainability.title')}</h3>
                <p className="text-gray-600">{t('about.values.sustainability.content')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-purple-600 mb-2">{t('about.values.community.title')}</h3>
                <p className="text-gray-600">{t('about.values.community.content')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-purple-600 mb-2">{t('about.values.innovation.title')}</h3>
                <p className="text-gray-600">{t('about.values.innovation.content')}</p>
              </div>
            </div>
          </section>

          <div className="relative h-80 rounded-xl overflow-hidden my-12">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" 
              alt="PurpleShop Impact" 
              className="w-full h-full object-cover"
            />
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('about.future.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('about.future.content')}
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