import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Star, Eye, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { useProductRating } from '../hooks/useProductRating';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product, quantity: number) => void;
  onView: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onView }) => {
  const [quantity, setQuantity] = useState(1);
  const { average, count } = useProductRating(product.id);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true }}
      onClick={() => onView(product)}
      className="group relative glass rounded-3xl overflow-hidden border border-white/10 hover:border-neon-cyan/50 transition-colors cursor-pointer"
    >
      <div className="aspect-square overflow-hidden relative">
        <motion.div 
          layoutId={`product-image-${product.id}`}
          className="w-full h-full"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onView(product); }}
            className="w-12 h-12 bg-white text-off-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            aria-label={`View details for ${product.name}`}
          >
            <Eye size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product, quantity); }}
            className="w-12 h-12 bg-neon-cyan text-off-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            aria-label={`Add ${quantity} ${product.name} to cart`}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        
        <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-neon-cyan">
          New Arrival
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              fill={i < Math.round(average || 5) ? "#00FFFF" : "none"} 
              className={i < Math.round(average || 5) ? "text-neon-cyan" : "text-white/20"} 
            />
          ))}
          <span className="text-[10px] text-white/40 ml-1">({count || 0} Reviews)</span>
        </div>
        <h3 className="text-xl font-display font-bold mb-1 group-hover:text-neon-cyan transition-colors">{product.name}</h3>
        <p className="text-white/40 text-sm mb-4 line-clamp-1">{product.description}</p>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price}</span>
            
            {/* Quantity Selector */}
            <div className="flex items-center glass rounded-xl px-2 py-1 border border-white/10" role="group" aria-label="Quantity selector">
              <button 
                onClick={handleDecrement}
                className="p-1 hover:text-neon-cyan transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold" aria-live="polite" aria-label={`Current quantity is ${quantity}`}>{quantity}</span>
              <button 
                onClick={handleIncrement}
                className="p-1 hover:text-neon-cyan transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button 
            onClick={() => onAddToCart(product, quantity)}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-neon-cyan hover:bg-neon-cyan hover:text-off-black transition-all"
            aria-label={`Add ${quantity} ${product.name} to bag`}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </motion.div>
  );
};
