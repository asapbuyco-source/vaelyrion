import React from 'react';
import { ArrowLeft, Clock, Share2, Sparkles, BookOpen, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import { SmartImage } from '../common/SmartImage';

export const ArticleDetailPage: React.FC = () => {
  const { 
    selectedArticleId, 
    setCurrentView, 
    products, 
    setSelectedProductId, 
    showToast,
    articles
  } = useStore();

  const article = articles.find(a => a.id === selectedArticleId) || articles[0];
  const featuredProducts = products.filter(p => article.featuredProductIds.includes(p.id));

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article Link Copied', 'Link saved to clipboard.', 'gold');
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      
      {/* Top Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-[#141414]/6">
        <div className="flex items-center justify-between text-xs text-stone-500 font-light">
          <button
            onClick={() => setCurrentView('discover')}
            className="hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Discover & Stories</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
        
        {/* Category & Meta */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 text-xs">
            <span className="bg-[#FAF5ED] text-[#8E7348] px-3 py-1 rounded-xs font-semibold uppercase tracking-wider border border-[#E8DFC8]">
              {article.category}
            </span>
            <span className="text-stone-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900 leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
            {article.subtitle}
          </p>

          <div className="pt-2 text-xs text-stone-500 font-light border-t border-[#141414]/8 flex items-center justify-between">
            <span>By <strong>{article.author}</strong></span>
            <span>{article.date}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="aspect-16/9 rounded-sm overflow-hidden bg-stone-100 border border-[#141414]/8 shadow-sm">
          <SmartImage
            src={article.image}
            alt={article.title}
            fallbackKind="editorial"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Quote */}
        {article.quote && (
          <div className="bg-[#F4EFEA] p-6 sm:p-8 rounded-sm border-l-4 border-[#B5935A] my-6">
            <p className="font-serif text-lg sm:text-xl italic text-stone-900 leading-snug">
              "{article.quote}"
            </p>
          </div>
        )}

        {/* Body Paragraphs */}
        <div className="space-y-6 text-sm sm:text-base text-stone-800 leading-relaxed font-light">
          {article.content.map((p, idx) => (
            <p key={idx} className={idx === 0 ? 'first-letter:text-4xl first-letter:font-serif first-letter:float-left first-letter:mr-2 first-letter:text-[#8E7348]' : ''}>
              {p}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-[#141414]/10 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-400 font-medium mr-2">Filed Under:</span>
          {article.tags.map(tag => (
            <span key={tag} className="bg-white border border-[#141414]/10 text-stone-700 text-xs px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Shoppable Featured Products inside the Article */}
        {featuredProducts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-[#141414]/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8E7348] font-semibold">
                  Featured In This Story
                </span>
                <h3 className="font-serif text-2xl text-stone-900 mt-1">Shop The Featured Look</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </article>

    </div>
  );
};
