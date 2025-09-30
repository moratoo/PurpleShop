import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Users, Rocket, Heart, Globe } from 'lucide-react';

export function Careers() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('careers.title')}</h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('careers.intro.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('careers.intro.content')}
            </p>
            <div className="relative h-80 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" 
                alt="Team working together" 
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('careers.values.title')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-purple-600 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('careers.values.teamwork.title')}</h3>
                <p className="text-gray-600">{t('careers.values.teamwork.content')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-purple-600 mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('careers.values.innovation.title')}</h3>
                <p className="text-gray-600">{t('careers.values.innovation.content')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-purple-600 mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('careers.values.passion.title')}</h3>
                <p className="text-gray-600">{t('careers.values.passion.content')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-purple-600 mb-4">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('careers.values.impact.title')}</h3>
                <p className="text-gray-600">{t('careers.values.impact.content')}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('careers.openings.title')}</h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('careers.openings.engineering.title')}</h3>
                <p className="text-gray-600 mb-4">{t('careers.openings.engineering.location')}</p>
                <p className="text-gray-600">{t('careers.openings.engineering.description')}</p>
                <button className="mt-4 text-purple-600 font-medium hover:text-purple-700">
                  {t('careers.openings.apply')} →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('careers.openings.design.title')}</h3>
                <p className="text-gray-600 mb-4">{t('careers.openings.design.location')}</p>
                <p className="text-gray-600">{t('careers.openings.design.description')}</p>
                <button className="mt-4 text-purple-600 font-medium hover:text-purple-700">
                  {t('careers.openings.apply')} →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('careers.openings.marketing.title')}</h3>
                <p className="text-gray-600 mb-4">{t('careers.openings.marketing.location')}</p>
                <p className="text-gray-600">{t('careers.openings.marketing.description')}</p>
                <button className="mt-4 text-purple-600 font-medium hover:text-purple-700">
                  {t('careers.openings.apply')} →
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('careers.benefits.title')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {t(`careers.benefits.items.${index}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`careers.benefits.items.${index}.content`)}
                  </p>
                </div>
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