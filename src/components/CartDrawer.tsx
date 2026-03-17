import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, q: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQuantity,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-off-black/80 backdrop-blur-sm z-[70]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-off-black border-l border-white/10 z-[80] flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-neon-cyan" size={24} />
                <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">Your Bag</h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close bag"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="text-lg font-medium">Your bag is empty</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 text-neon-cyan font-bold uppercase tracking-widest text-xs hover:underline"
                    aria-label="Start shopping"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                          aria-label={`Remove ${item.name} from bag`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-white/40 text-sm mb-3">${item.price}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center glass rounded-lg px-2" role="group" aria-label={`Quantity selector for ${item.name}`}>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:text-neon-cyan transition-colors"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-bold" aria-live="polite" aria-label={`Current quantity is ${item.quantity}`}>{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-neon-cyan transition-colors"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-neon-cyan">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 glass border-t border-white/10 space-y-4">
                <div className="flex justify-between text-white/60 text-sm uppercase tracking-widest font-bold">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-display font-bold tracking-tighter">
                  <span>Total</span>
                  <span className="text-neon-cyan">${total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-4 bg-neon-cyan text-off-black font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform neon-glow-cyan"
                  aria-label={`Proceed to checkout, total is ${total.toFixed(2)} dollars`}
                >
                  Checkout Now <ArrowRight size={20} />
                </button>
                <p className="text-[10px] text-center text-white/30 uppercase tracking-widest">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
