import React from 'react';
import { Zap, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-off-black pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-neon-cyan rounded-lg flex items-center justify-center">
                <Zap className="text-off-black" size={18} />
              </div>
              <span className="text-xl font-display font-bold tracking-tighter">
                JANSEN'S <span className="text-neon-cyan">DROPS</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Curating the future of daily essentials. High-performance gear for the modern lifestyle.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 glass rounded-lg hover:text-neon-cyan transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 glass rounded-lg hover:text-neon-cyan transition-colors"><Twitter size={18} /></a>
              <a href="#" className="p-2 glass rounded-lg hover:text-neon-cyan transition-colors"><Youtube size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><a href="#shop" className="hover:text-white transition-colors">All Products</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#categories" className="hover:text-white transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-sm text-white/40 mb-6">Join the elite. Get early access to drops.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-neon-cyan transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neon-cyan">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:row items-center justify-between pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
          <p>&copy; 2026 JANSEN'S DROPS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
