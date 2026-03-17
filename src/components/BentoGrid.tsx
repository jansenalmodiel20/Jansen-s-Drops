import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Headphones, Watch, Layout } from 'lucide-react';

const categories = [
  {
    title: 'Modern Tech',
    count: '12 Items',
    icon: <Smartphone className="text-neon-cyan" />,
    className: 'md:col-span-2 md:row-span-2 bg-gradient-to-br from-neon-cyan/10 to-transparent',
    image: 'https://picsum.photos/seed/tech/800/800'
  },
  {
    title: 'Audio Gear',
    count: '8 Items',
    icon: <Headphones className="text-electric-purple" />,
    className: 'bg-gradient-to-br from-electric-purple/10 to-transparent',
    image: 'https://picsum.photos/seed/audio-cat/600/600'
  },
  {
    title: 'Wearables',
    count: '5 Items',
    icon: <Watch className="text-white" />,
    className: 'bg-white/5',
    image: 'https://picsum.photos/seed/watch-cat/600/600'
  },
  {
    title: 'Workspace',
    count: '15 Items',
    icon: <Layout className="text-neon-cyan" />,
    className: 'md:col-span-2 bg-gradient-to-r from-neon-cyan/5 to-electric-purple/5',
    image: 'https://picsum.photos/seed/desk-cat/800/400'
  }
];

interface BentoGridProps {
  onSelectCategory: (category: string) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onSelectCategory }) => {
  const handleCategoryClick = (title: string) => {
    // Map display titles to actual categories in PRODUCTS
    const mapping: { [key: string]: string } = {
      'Modern Tech': 'Tech',
      'Audio Gear': 'Audio',
      'Wearables': 'Wearables',
      'Workspace': 'Furniture'
    };
    onSelectCategory(mapping[title] || 'All');
    
    // Scroll to shop section
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-24 max-w-7xl mx-auto px-6">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tighter">
          SHOP BY <span className="text-neon-cyan">CATEGORY</span>
        </h2>
        <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold">Curated for excellence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(cat.title)}
            className={`relative rounded-3xl overflow-hidden border border-white/5 group cursor-pointer ${cat.className}`}
            aria-label={`Shop ${cat.title}`}
          >
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-off-black via-off-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center mb-3">
                {cat.icon}
              </div>
              <h3 className="text-2xl font-display font-bold mb-1">{cat.title}</h3>
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{cat.count}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
