import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Leaf, Users, Recycle } from 'lucide-react';

export function SocialImpact() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('impact.title')}</h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('impact.commitment.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('impact.commitment.content')}
            </p>
            <div className="relative h-80 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b" 
                alt="Community Impact" 
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-purple-600 mb-4">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">{t('impact.metrics.environmental.title')}</h3>
              <p className="text-gray-600">
                {t('impact.metrics.environmental.content')}
              </p>
              <div className="mt-4">
                <div className="text-2xl font-bold text-purple-600">{t('impact.metrics.environmental.metric')}</div>
                <div className="text-sm text-gray-500">{t('impact.metrics.environmental.label')}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-purple-600 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">{t('impact.metrics.community.title')}</h3>
              <p className="text-gray-600">
                {t('impact.metrics.community.content')}
              </p>
              <div className="mt-4">
                <div className="text-2xl font-bold text-purple-600">{t('impact.metrics.community.metric')}</div>
                <div className="text-sm text-gray-500">{t('impact.metrics.community.label')}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-purple-600 mb-4">
                <Recycle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">{t('impact.metrics.circular.title')}</h3>
              <p className="text-gray-600">
                {t('impact.metrics.circular.content')}
              </p>
              <div className="mt-4">
                <div className="text-2xl font-bold text-purple-600">{t('impact.metrics.circular.metric')}</div>
                <div className="text-sm text-gray-500">{t('impact.metrics.circular.label')}</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('impact.programs.title')}</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-purple-600 mb-2">{t('impact.programs.education.title')}</h3>
                <p className="text-gray-600">
                  {t('impact.programs.education.content')}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-purple-600 mb-2">{t('impact.programs.community.title')}</h3>
                <p className="text-gray-600">
                  {t('impact.programs.community.content')}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-purple-600 mb-2">{t('impact.programs.entrepreneurship.title')}</h3>
                <p className="text-gray-600">
                  {t('impact.programs.entrepreneurship.content')}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('impact.sdgs.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('impact.sdgs.content')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌍</div>
                <div className="text-sm font-medium">{t('impact.sdgs.climate')}</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🏭</div>
                <div className="text-sm font-medium">{t('impact.sdgs.production')}</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🤝</div>
                <div className="text-sm font-medium">{t('impact.sdgs.partnerships')}</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-sm font-medium">{t('impact.sdgs.sustainable')}</div>
              </div>
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