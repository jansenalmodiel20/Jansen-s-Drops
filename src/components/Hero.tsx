import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onViewCollection: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onViewCollection }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-cyan/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-electric-purple/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm font-medium text-neon-cyan">
            <Sparkles size={16} />
            <span>2026 Collection Now Live</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-6">
            SOLVE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-electric-purple">
              DAILY HUSTLE.
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-lg mb-10 leading-relaxed">
            We curate high-performance gear that eliminates friction from your life. 
            Modern solutions for the modern human.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onShopNow}
              className="px-8 py-4 bg-neon-cyan text-off-black font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform neon-glow-cyan"
            >
              Shop Best Sellers <ArrowRight size={20} />
            </button>
            <button 
              onClick={onViewCollection}
              className="px-8 py-4 glass text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              View Collection
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-white/40">
            <div className="flex items-center gap-2">
              <Truck size={18} />
              <span className="text-xs font-medium uppercase tracking-wider">Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <span className="text-xs font-medium uppercase tracking-wider">Secure Checkout</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/tech-hero/1200/1200" 
              alt="Hero Product" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-off-black/80 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neon-cyan">Featured Item</span>
                <span className="text-xl font-bold">$129.99</span>
              </div>
              <h3 className="text-2xl font-display font-bold">Lumix Aura G1</h3>
            </div>
          </div>
          
          {/* Floating Element */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 glass p-4 rounded-2xl z-20 hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-electric-purple rounded-xl flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Efficiency</p>
                <p className="font-bold">+45% Boost</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
