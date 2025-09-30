import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Download, ExternalLink } from 'lucide-react';

export function Press() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('press.title')}</h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('press.contact.title')}</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">{t('press.contact.description')}</p>
              <div className="space-y-2">
                <p className="text-gray-800">
                  <strong>{t('press.contact.email')}:</strong> press@purpleshop.com
                </p>
                <p className="text-gray-800">
                  <strong>{t('press.contact.phone')}:</strong> +34 900 123 456
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('press.releases.title')}</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-2">{t(`press.releases.items.${index}.date`)}</p>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {t(`press.releases.items.${index}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-4">{t(`press.releases.items.${index}.summary`)}</p>
                  <button className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {t('press.releases.readMore')}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('press.kit.title')}</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-6">{t('press.kit.description')}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1557200134-90327ee9fafa"
                    alt="Logo Preview"
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    <Download className="h-4 w-4" />
                    <span>{t('press.kit.downloadLogos')}</span>
                  </button>
                </div>
                <div className="border border-gray-200 rounded p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1542744094-24638eff58bb"
                    alt="Brand Guidelines Preview"
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    <Download className="h-4 w-4" />
                    <span>{t('press.kit.downloadGuidelines')}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('press.coverage.title')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <a 
                  key={index}
                  href="#"
                  className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <img 
                    src={`https://images.unsplash.com/photo-${1550000000000 + index}`}
                    alt={t(`press.coverage.items.${index}.title`)}
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                  <p className="text-sm text-gray-500 mb-2">{t(`press.coverage.items.${index}.source`)}</p>
                  <h3 className="text-lg font-medium text-gray-900">
                    {t(`press.coverage.items.${index}.title`)}
                  </h3>
                </a>
              ))}
            </div>
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