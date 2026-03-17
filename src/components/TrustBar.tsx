import React from 'react';
import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

const trustItems = [
  { icon: <Truck size={32} className="text-neon-cyan" />, title: 'Fast Shipping', desc: 'Worldwide delivery in 3-5 days' },
  { icon: <ShieldCheck size={32} className="text-electric-purple" />, title: 'Secure Checkout', desc: '256-bit SSL encryption' },
  { icon: <RotateCcw size={32} className="text-white" />, title: 'Easy Returns', desc: '30-day money back guarantee' },
  { icon: <CreditCard size={32} className="text-neon-cyan" />, title: 'Pay Later', desc: 'Interest-free installments' }
];

export const TrustBar: React.FC = () => {
  return (
    <section id="trust" className="py-24 glass border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {trustItems.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="mb-6 p-6 rounded-3xl bg-white/5 group-hover:bg-white/10 transition-colors">
              {item.icon}
            </div>
            <h3 className="text-xl font-display font-bold mb-2 uppercase tracking-tighter">{item.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
