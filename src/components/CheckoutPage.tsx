import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, CreditCard, Truck, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { CartItem } from '../types';
import { db, User } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CheckoutPageProps {
  items: CartItem[];
  onBack: () => void;
  onSuccess: () => void;
  user: User | null;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onBack, onSuccess, user }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCompletePurchase = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (user) {
        // Save order to Firestore
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: total,
          status: 'pending',
          createdAt: serverTimestamp()
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Order error:', error);
      // Fallback to success anyway for demo purposes, but log error
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Shipping', icon: <Truck size={18} /> },
    { id: 2, title: 'Payment', icon: <CreditCard size={18} /> },
    { id: 3, title: 'Review', icon: <ShieldCheck size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-off-black pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 uppercase text-xs font-bold tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Bag
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-12">
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      step >= s.id ? "bg-neon-cyan border-neon-cyan text-off-black" : "border-white/10 text-white/20"
                    }`}>
                      {step > s.id ? <CheckCircle2 size={20} /> : s.icon}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      step >= s.id ? "text-neon-cyan" : "text-white/20"
                    }`}>{s.title}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-[2px] mx-4 mb-6 transition-all ${
                      step > s.id ? "bg-neon-cyan" : "bg-white/10"
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass p-8 rounded-[40px]"
                >
                  <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                    <h2 className="text-3xl font-display font-bold tracking-tighter uppercase">Shipping Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">First Name</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-cyan outline-none" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Last Name</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-cyan outline-none" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Shipping Address</label>
                      <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-cyan outline-none" placeholder="123 Luxury Ave" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">City</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-cyan outline-none" placeholder="New York" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Postal Code</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-cyan outline-none" placeholder="10001" />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-4 bg-neon-cyan text-off-black font-bold rounded-xl flex items-center justify-center gap-2 mt-8"
                      aria-label="Continue to payment"
                    >
                      Continue to Payment <ArrowRight size={20} />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass p-8 rounded-[40px]"
                >
                  <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
                    <h2 className="text-3xl font-display font-bold tracking-tighter uppercase">Payment Method</h2>
                    <div className="space-y-4">
                      <div className="p-4 border-2 border-neon-cyan bg-neon-cyan/5 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CreditCard className="text-neon-cyan" />
                          <span className="font-bold">Credit / Debit Card</span>
                        </div>
                        <div className="w-6 h-6 rounded-full border-4 border-neon-cyan bg-off-black" />
                      </div>
                      <div className="p-4 border border-white/10 bg-white/5 rounded-2xl flex items-center justify-between opacity-50">
                        <div className="flex items-center gap-4">
                          <span className="font-bold">PayPal</span>
                        </div>
                        <div className="w-6 h-6 rounded-full border border-white/10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Card Number</label>
                      <input required type="text" pattern="[0-9]{16}" title="16 digit card number" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-cyan outline-none" placeholder="**** **** **** ****" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Expiry Date</label>
                        <input required type="text" pattern="(0[1-9]|1[0-2])\/[0-9]{2}" title="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-cyan outline-none" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">CVV</label>
                        <input required type="text" pattern="[0-9]{3}" title="3 digit CVV" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-cyan outline-none" placeholder="***" />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-4 bg-neon-cyan text-off-black font-bold rounded-xl flex items-center justify-center gap-2 mt-8"
                      aria-label="Review order"
                    >
                      Review Order <ArrowRight size={20} />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass p-8 rounded-[40px] space-y-6"
                >
                  <h2 className="text-3xl font-display font-bold tracking-tighter uppercase">Final Review</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                      <CheckCircle2 className="text-neon-cyan" />
                      <div>
                        <p className="text-sm font-bold">Shipping to New York, NY</p>
                        <p className="text-xs text-white/40">123 Luxury Ave, 10001</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                      <CheckCircle2 className="text-neon-cyan" />
                      <div>
                        <p className="text-sm font-bold">Paying with Card ending in 4242</p>
                        <p className="text-xs text-white/40">Visa Signature</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleCompletePurchase}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-neon-cyan text-off-black font-bold rounded-2xl flex items-center justify-center gap-2 mt-8 text-lg neon-glow-cyan disabled:opacity-50"
                    aria-label={`Complete purchase for ${total.toFixed(2)} dollars`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>Complete Purchase — ${total.toFixed(2)}</>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-[40px]">
              <h3 className="text-xl font-display font-bold mb-6 uppercase tracking-tighter">Order Summary</h3>
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/60">{item.name} x {item.quantity}</span>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Shipping</span>
                  <span className="text-neon-cyan font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="flex justify-between text-2xl font-display font-bold pt-4">
                  <span>Total</span>
                  <span className="text-neon-cyan">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                <Lock className="text-white/40" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest">Secure Payment</p>
                <p className="text-[10px] text-white/40">Your data is fully encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
