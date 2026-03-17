import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Truck, ArrowLeft, ShoppingCart, Zap, CheckCircle2, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { ReviewSystem } from './ReviewSystem';
import { useProductRating } from '../hooks/useProductRating';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, quantity: number) => void;
  user: any | null;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, onBack, onAddToCart, user }) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const { average, count } = useProductRating(product.id);

  return (
    <div className="min-h-screen bg-off-black pt-24 pb-20">
      {/* Social Proof Ticker */}
      <div className="bg-neon-cyan/10 border-y border-neon-cyan/20 py-2 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neon-cyan">
              <Zap size={12} />
              <span>Someone just bought a {product.name} in New York</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 uppercase text-xs font-bold tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Shop
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              layoutId={`product-image-${product.id}`}
              className="aspect-square rounded-[40px] overflow-hidden border border-white/10 glass relative"
            >
              {selectedImage.endsWith('.mp4') || selectedImage.includes('youtube.com') || selectedImage.includes('youtu.be') ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  {selectedImage.includes('youtube.com') || selectedImage.includes('youtu.be') ? (
                    <iframe
                      src={selectedImage.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video src={selectedImage} controls className="w-full h-full object-contain" />
                  )}
                </div>
              ) : (
                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
              )}

              {/* Floating Sample Badge */}
              {product.images && product.images.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-6 right-6 w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 glass shadow-2xl hidden md:block"
                >
                  <img src={product.images[0]} alt="Sample" className="w-full h-full object-cover" />
                </motion.div>
              )}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-4 gap-4"
            >
              {[product.image, ...(product.images || []), ...(product.videoUrl ? [product.videoUrl] : [])].slice(0, 8).map((media, i) => (
                <motion.button 
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(media)}
                  className={cn(
                    "aspect-square rounded-2xl overflow-hidden border-2 transition-all bg-black/20",
                    selectedImage === media ? "border-neon-cyan" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  {media.endsWith('.mp4') || media.includes('youtube.com') || media.includes('youtu.be') ? (
                    <div className="w-full h-full flex items-center justify-center text-neon-cyan">
                      <Zap size={24} />
                    </div>
                  ) : (
                    <img src={media} alt="" className="w-full h-full object-cover" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-neon-cyan">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.round(average || 5) ? "currentColor" : "none"} 
                    className={i < Math.round(average || 5) ? "" : "text-white/20"}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest">
                {average > 0 ? average.toFixed(1) : '5.0'} ({count} Reviews)
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tighter leading-none">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-bold text-neon-cyan">${product.price}</span>
              <span className="text-xl text-white/20 line-through">${(product.price * 1.5).toFixed(2)}</span>
              <span className="bg-electric-purple/20 text-electric-purple text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Save 33%</span>
            </div>

            <p className="text-lg text-white/60 leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="space-y-4 mb-10">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-neon-cyan" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6 mb-12">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Quantity</span>
                <div className="flex items-center glass rounded-2xl px-4 py-2 border border-white/10" role="group" aria-label="Quantity selector">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 hover:text-neon-cyan transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center text-lg font-bold" aria-live="polite" aria-label={`Current quantity is ${quantity}`}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-2 hover:text-neon-cyan transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onAddToCart(product, quantity)}
                  className="flex-1 py-5 bg-neon-cyan text-off-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform neon-glow-cyan"
                  aria-label={`Add ${quantity} ${product.name} to bag`}
                >
                  <ShoppingCart size={20} /> Add to Bag
                </button>
                <button 
                  className="flex-1 py-5 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-colors"
                  aria-label="Buy with Apple Pay"
                >
                  Buy with Apple Pay
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-2xl flex items-center gap-3">
                <Truck className="text-neon-cyan" size={24} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Shipping</p>
                  <p className="text-sm font-bold">Free Express</p>
                </div>
              </div>
              <div className="glass p-4 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="text-electric-purple" size={24} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Warranty</p>
                  <p className="text-sm font-bold">2 Year Global</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Before/After Section - Scrollytelling feel */}
        {product.beforeImage && product.afterImage && (
          <section className="mt-32 py-24 border-t border-white/5">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tighter uppercase">The Transformation</h2>
              <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold">See the difference</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative rounded-[40px] overflow-hidden group">
                <img src={product.beforeImage} alt="Before" className="w-full aspect-video object-cover" />
                <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Before</div>
              </div>
              <div className="relative rounded-[40px] overflow-hidden group border-2 border-neon-cyan neon-glow-cyan">
                <img src={product.afterImage} alt="After" className="w-full aspect-video object-cover" />
                <div className="absolute top-6 left-6 bg-neon-cyan text-off-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">After</div>
              </div>
            </div>
          </section>
        )}

        {/* Review System */}
        <ReviewSystem productId={product.id} user={user} />
      </div>

      {/* Sticky Mobile Add to Cart */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 glass z-40 border-t border-white/10">
        <button 
          onClick={() => onAddToCart(product, quantity)}
          className="w-full py-4 bg-neon-cyan text-off-black font-bold rounded-xl flex items-center justify-center gap-2 neon-glow-cyan"
        >
          Add to Bag — ${(product.price * quantity).toFixed(2)}
        </button>
      </div>
    </div>
  );
};
