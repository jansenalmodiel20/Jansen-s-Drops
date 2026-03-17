import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Zap, LogIn, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { User } from '../firebase';
import { Page } from '../types';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onNavigate: (page: Page) => void;
  user: User | null;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onNavigate, user, isAdmin, onLogin, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "glass py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group cursor-pointer"
          aria-label="Go to homepage"
        >
          <div className="w-10 h-10 bg-neon-cyan rounded-xl flex items-center justify-center neon-glow-cyan transform group-hover:rotate-12 transition-transform">
            <Zap className="text-off-black fill-current" size={24} />
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter">
            JANSEN'S <span className="text-neon-cyan">DROPS</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-white/70">
          <a href="#shop" className="hover:text-neon-cyan transition-colors" aria-label="Shop">Shop</a>
          <a href="#categories" className="hover:text-neon-cyan transition-colors" aria-label="Categories">Categories</a>
          <a href="#trust" className="hover:text-neon-cyan transition-colors" aria-label="Why Us">Why Us</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onCartClick}
            className="relative p-2 glass rounded-full hover:bg-white/10 transition-colors"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-electric-purple text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:border-neon-cyan transition-colors"
                aria-label="User menu"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 glass rounded-2xl p-2 border border-white/10 shadow-2xl"
                  >
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                      <p className="text-xs font-bold truncate">{user.displayName || 'User'}</p>
                      <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <UserIcon size={16} /> My Profile
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => { onNavigate('admin'); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold hover:bg-white/5 rounded-xl transition-colors text-neon-cyan"
                      >
                        <Shield size={16} /> Admin Panel
                      </button>
                    )}
                    <button 
                      onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold hover:bg-white/5 rounded-xl transition-colors text-red-400"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="hidden md:flex items-center gap-2 px-4 py-2 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:border-neon-cyan transition-colors"
            >
              <LogIn size={16} /> Sign In
            </button>
          )}

          <button 
            className="md:hidden p-2 glass rounded-full"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu - Thumb Zone Optimized */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[60] glass flex flex-col items-center justify-center p-8"
          >
            <button 
              className="absolute top-8 right-8 p-3 glass rounded-full"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close mobile menu"
            >
              <X size={24} />
            </button>
            
            <nav className="flex flex-col items-center gap-8 text-3xl font-display font-bold uppercase">
              <a 
                href="#shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-neon-cyan"
                aria-label="Shop"
              >
                Shop
              </a>
              <a href="#categories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neon-cyan" aria-label="Categories">Categories</a>
              <a href="#trust" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neon-cyan" aria-label="Why Us">Why Us</a>
              <button 
                onClick={() => { onCartClick(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-4 text-electric-purple"
                aria-label={`Open cart, ${cartCount} items`}
              >
                Cart ({cartCount})
              </button>

              {user ? (
                <>
                  <button 
                    onClick={() => { onNavigate('profile'); setIsMobileMenuOpen(false); }}
                    className="hover:text-neon-cyan"
                    aria-label="My Profile"
                  >
                    My Profile
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}
                      className="text-neon-cyan"
                      aria-label="Admin Panel"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button 
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    className="text-red-400"
                    aria-label="Sign out"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                  className="text-neon-cyan"
                  aria-label="Sign in"
                >
                  Sign In
                </button>
              )}
            </nav>
            
            <div className="mt-20 text-white/30 text-xs tracking-[0.3em] uppercase">
              Jansen's Drops &copy; 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
