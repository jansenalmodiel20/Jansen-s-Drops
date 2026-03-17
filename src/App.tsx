import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { ProductCard } from './components/ProductCard';
import { TrustBar } from './components/TrustBar';
import { Footer } from './components/Footer';
import { ProductPage } from './components/ProductPage';
import { CheckoutPage } from './components/CheckoutPage';
import { CartDrawer } from './components/CartDrawer';
import { ChatBot } from './components/ChatBot';
import { ImageGenerator } from './components/ImageGenerator';
import { FastAISearch } from './components/FastAISearch';
import { UserProfilePage } from './components/UserProfilePage';
import { AdminPanel } from './components/AdminPanel';
import { PRODUCTS } from './constants';
import { Product, CartItem, Page } from './types';
import { CheckCircle2, ShoppingBag, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { collection, query, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User } from './firebase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Fetch products from Firestore
  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => doc.data() as Product);
      if (productsData.length > 0) {
        setProducts(productsData);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);

      if (firebaseUser) {
        // Check/Create user profile in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const isDefaultAdmin = firebaseUser.email === 'jansenalmodiel122@gmail.com';
          const newUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: isDefaultAdmin ? 'admin' : 'user',
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, newUser);
          setIsAdmin(isDefaultAdmin);
        } else {
          setIsAdmin(userSnap.data().role === 'admin');
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('jansen-drops-cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('jansen-drops-cart', JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    setShowSuccess(true);
    setCurrentPage('home');
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const scrollToShop = () => {
    const element = document.getElementById('shop');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-off-black selection:bg-neon-cyan selection:text-off-black">
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={(page) => { setCurrentPage(page); window.scrollTo(0, 0); }}
        user={user}
        isAdmin={isAdmin}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onShopNow={scrollToShop} onViewCollection={scrollToShop} />
              
              <section id="shop" className="py-24 max-w-7xl mx-auto px-6">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tighter">
                      BEST <span className="text-neon-cyan">SELLERS</span>
                    </h2>
                    <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold">Performance driven design</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                          selectedCategory === cat 
                            ? "bg-neon-cyan text-off-black border-neon-cyan neon-glow-cyan" 
                            : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                        }`}
                        aria-label={`Filter by ${cat}`}
                        aria-pressed={selectedCategory === cat}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map(product => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard 
                          product={product} 
                          onAddToCart={addToCart}
                          onView={handleViewProduct}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>

              <BentoGrid onSelectCategory={setSelectedCategory} />
              <FastAISearch onViewProduct={handleViewProduct} />
              <TrustBar />
            </motion.div>
          )}

          {currentPage === 'product' && selectedProduct && (
            <motion.div
              key="product"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ProductPage 
                product={selectedProduct} 
                onBack={() => setCurrentPage('home')}
                onAddToCart={addToCart}
                user={user}
              />
            </motion.div>
          )}

          {currentPage === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CheckoutPage 
                items={cart}
                onBack={() => setCurrentPage('home')}
                onSuccess={handleCheckoutSuccess}
                user={user}
              />
            </motion.div>
          )}

          {currentPage === 'profile' && user && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <UserProfilePage 
                user={user}
                onBack={() => setCurrentPage('home')}
              />
            </motion.div>
          )}

          {currentPage === 'admin' && isAdmin && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdminPanel 
                onBack={() => setCurrentPage('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Global Overlays */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />

      <ChatBot />
      <ImageGenerator />

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-2xl flex items-center gap-4 z-[100] border-neon-cyan neon-glow-cyan"
          >
            <div className="w-10 h-10 bg-neon-cyan rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-off-black" size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold">Order Confirmed!</h4>
              <p className="text-xs text-white/40">Check your email for tracking info.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart for Mobile */}
      {cart.length > 0 && currentPage !== 'checkout' && (
        <motion.button 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="md:hidden fixed bottom-24 right-8 w-14 h-14 bg-neon-cyan text-off-black rounded-full flex items-center justify-center neon-glow-cyan z-40 shadow-2xl"
        >
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-electric-purple text-white text-[10px] font-bold flex items-center justify-center rounded-full">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </motion.button>
      )}
    </div>
  );
}
