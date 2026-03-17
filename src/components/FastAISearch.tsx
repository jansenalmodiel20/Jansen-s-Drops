import React, { useState } from 'react';
import { Search, Zap, Loader2, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface FastAISearchProps {
  onViewProduct: (p: Product) => void;
}

export const FastAISearch: React.FC<FastAISearchProps> = ({ onViewProduct }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProduct, setSuggestedProduct] = useState<Product | null>(null);

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setSuggestedProduct(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: [{ text: `User is looking for: ${query}. Based on these products: ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, desc: p.description })))}. Recommend the best one and explain why in 1 sentence. Return as JSON: { "productId": "id", "reason": "reason" }` }],
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data.reason);
      const product = PRODUCTS.find(p => p.id === data.productId);
      if (product) setSuggestedProduct(product);
    } catch (error) {
      console.error('Fast AI error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 max-w-3xl mx-auto px-6">
      <div className="glass p-8 rounded-[40px] border-neon-cyan/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-neon-cyan/20 rounded-xl flex items-center justify-center">
            <Zap className="text-neon-cyan" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">Fast AI Product Finder</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Low-Latency Intelligence</p>
          </div>
        </div>

        <div className="relative mb-6">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="What problem can we solve for you today?"
            className="w-full bg-off-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-neon-cyan outline-none transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <button 
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neon-cyan text-off-black rounded-xl disabled:opacity-50"
            aria-label="Search for products using AI"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {result && suggestedProduct && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white/5 rounded-3xl border border-white/10"
            >
              <p className="text-sm text-white/80 mb-4 italic" aria-live="polite">"{result}"</p>
              <div className="flex items-center gap-4 p-3 glass rounded-2xl">
                <img src={suggestedProduct.image} alt={suggestedProduct.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{suggestedProduct.name}</h4>
                  <p className="text-xs text-neon-cyan">${suggestedProduct.price}</p>
                </div>
                <button 
                  onClick={() => onViewProduct(suggestedProduct)}
                  className="text-[10px] font-bold uppercase tracking-widest bg-white text-off-black px-3 py-2 rounded-lg"
                  aria-label={`View ${suggestedProduct.name}`}
                >
                  View
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
