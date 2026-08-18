import React from 'react';
import { ArrowRight, Clock, Sparkles, BookOpen, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MOCK_ARTICLES } from '../../data/mockData';
import { DiscoverArticle } from '../../types';

export const DiscoverPage: React.FC = () => {
  const { 
    setSelectedArticleId, 
    setCurrentView,
    setSelectedProductId,
    products
  } = useStore();

  const handleArticleClick = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentView('discover-article');
  };

  const featuredArticle = MOCK_ARTICLES[0];
  const secondaryArticles = MOCK_ARTICLES.slice(1);

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      {/* Editorial Header */}
      <div className="bg-[#F4EFEA] border-b border-[#141414]/10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8E7348] font-semibold">
            The Tanelia Gazette & Lookbook
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#141414]">
            DISCOVER & INSPIRATION
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-xl mx-auto leading-relaxed">
            High-fashion hair craft, invisible lace masterclasses, sustainable weekly batch logistics, and salon-grade styling protocols.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        
        {/* Large Featured Editorial Story */}
        {featuredArticle && (
          <div 
            onClick={() => handleArticleClick(featuredArticle.id)}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-[#141414]/10 rounded-sm overflow-hidden shadow-xs hover:border-[#B5935A] transition-all cursor-pointer"
          >
            <div className="lg:col-span-7 aspect-16/10 lg:aspect-auto overflow-hidden bg-stone-100">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className="bg-[#FAF5ED] text-[#8E7348] px-2.5 py-0.5 rounded-xs font-semibold uppercase tracking-wider border border-[#E8DFC8]">
                    {featuredArticle.category}
                  </span>
                  <span className="text-stone-400 flex items-center gap-1 font-light">
                    <Clock className="w-3 h-3" />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium group-hover:text-[#8E7348] transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                  {featuredArticle.subtitle}
                </p>

                {featuredArticle.quote && (
                  <blockquote className="border-l-2 border-[#B5935A] pl-4 italic text-stone-700 text-xs font-serif leading-relaxed">
                    "{featuredArticle.quote}"
                  </blockquote>
                )}
              </div>

              <div className="pt-4 border-t border-[#141414]/8 flex items-center justify-between">
                <div className="text-xs text-stone-500 font-light">
                  <span>By {featuredArticle.author}</span>
                </div>

                <div className="flex items-center gap-1 text-xs uppercase tracking-widest font-semibold text-[#141414] group-hover:text-[#8E7348]">
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Editorial Stories */}
        <div className="space-y-6">
          <div className="border-b border-[#141414]/10 pb-4">
            <h3 className="font-serif text-2xl text-stone-900 font-medium">Masterclasses & Atelier Notes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {secondaryArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(article.id)}
                className="group bg-white border border-[#141414]/10 hover:border-[#B5935A] rounded-sm overflow-hidden transition-all shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-16/9 overflow-hidden bg-stone-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#8E7348] font-semibold uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-400 text-[11px] font-light">{article.readTime}</span>
                    </div>

                    <h4 className="font-serif text-xl text-stone-900 font-medium group-hover:text-[#8E7348] transition-colors leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-2">
                      {article.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#141414]/8 flex items-center justify-between text-xs text-stone-500 font-light">
                    <span>{article.date}</span>
                    <span className="text-black font-medium flex items-center gap-1 group-hover:text-[#8E7348]">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Find This Hair Signature Interactive Teaser */}
        <div className="bg-[#141414] text-[#FAF8F5] p-8 sm:p-12 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-[#B5935A] font-semibold">
              Signature Visual Search
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Seen a look you love on social media?
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Upload any screenshot from Instagram or TikTok. Our visual search engine analyzes hair wave pattern, density, and lace transparency to recommend the exact atelier piece.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('find-hair')}
            className="bg-[#B5935A] hover:bg-[#C5A880] text-black text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-2xl transition-all shrink-0 shadow-lg cursor-pointer active:scale-[0.98]"
          >
            Launch Visual Search
          </button>
        </div>

      </div>

    </div>
  );
};
