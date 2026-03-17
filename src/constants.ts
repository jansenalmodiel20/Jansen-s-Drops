import { Product } from './types';

export const PRODUCTS: Product[] = [
  // TECH CATEGORY
  {
    id: '1',
    name: 'Lumix Aura G1',
    price: 129.99,
    description: 'The ultimate ambient lighting solution for modern workspaces. Experience productivity-enhancing illumination.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    category: 'Tech',
    features: ['Adaptive Brightness', 'Voice Control', '16M Colors', 'Eye-Safe Tech'],
    beforeImage: 'https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?auto=format&fit=crop&q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 't2',
    name: 'CyberBoard R3',
    price: 349.99,
    description: 'Mechanical precision meets cyberpunk aesthetics. The ultimate typing experience for creators.',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
    category: 'Tech',
    features: ['Hot-swappable', 'RGB Matrix', 'Aluminum Case', 'Wireless']
  },
  {
    id: 't3',
    name: 'Vision Beam 4K',
    price: 899.99,
    description: 'Ultra-short throw laser projector. Turn any wall into a 120-inch cinematic experience.',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646bebbfc?auto=format&fit=crop&q=80&w=800',
    category: 'Tech',
    features: ['4K Resolution', 'HDR10+', 'Built-in Audio', 'Smart OS']
  },
  {
    id: 't4',
    name: 'Nexus Hub Pro',
    price: 79.99,
    description: 'The only dock you will ever need. Seamlessly connect all your peripherals with one cable.',
    image: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&q=80&w=800',
    category: 'Tech',
    features: ['12-in-1 Design', '100W PD', 'Dual 4K Display', 'SD Card Slot']
  },
  {
    id: 't5',
    name: 'Aura Mirror',
    price: 450.00,
    description: 'Smart fitness mirror that blends into your home. Real-time coaching and tracking.',
    image: 'https://images.unsplash.com/photo-1632548260498-b72450669931?auto=format&fit=crop&q=80&w=800',
    category: 'Tech',
    features: ['Touch Display', 'AI Coaching', 'Bluetooth Audio', 'Hidden Camera']
  },

  // AUDIO CATEGORY
  {
    id: '2',
    name: 'Zenith Pods Pro',
    price: 199.99,
    description: 'Immersive soundscapes with industry-leading noise cancellation. Designed for the urban explorer.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    category: 'Audio',
    features: ['Active Noise Cancelling', '40h Battery', 'Spatial Audio', 'Water Resistant']
  },
  {
    id: 'a2',
    name: 'Sonic Sphere X',
    price: 299.99,
    description: '360-degree high-fidelity audio. Fill your room with crystal clear sound from every angle.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    category: 'Audio',
    features: ['360 Sound', 'WiFi Streaming', 'Voice Assistant', 'Multi-room']
  },
  {
    id: 'a3',
    name: 'Vintage Vinyl One',
    price: 399.99,
    description: 'Classic warmth meets modern tech. High-end turntable with integrated Bluetooth output.',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800',
    category: 'Audio',
    features: ['Carbon Tonearm', 'Bluetooth 5.2', 'Pre-amp Built-in', 'Solid Wood Base']
  },
  {
    id: 'a4',
    name: 'Studio Mic Master',
    price: 159.99,
    description: 'Professional grade recording at home. Perfect for podcasters and musicians alike.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    category: 'Audio',
    features: ['Cardioid Pattern', 'USB-C / XLR', 'Zero Latency', 'Pop Filter']
  },
  {
    id: 'a5',
    name: 'Echo Buds Lite',
    price: 89.99,
    description: 'Compact, powerful, and affordable. The perfect daily companion for music on the go.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    category: 'Audio',
    features: ['Touch Controls', '24h Total Play', 'Fast Charge', 'Deep Bass']
  },

  // WEARABLES CATEGORY
  {
    id: '3',
    name: 'Nova Smart Ring',
    price: 249.99,
    description: 'Health tracking refined. Monitor your vitals with elegance and precision.',
    image: 'https://images.unsplash.com/photo-1613113087245-fbc3975d7729?auto=format&fit=crop&q=80&w=800',
    category: 'Wearables',
    features: ['Sleep Tracking', 'Heart Rate', 'Titanium Build', '7-Day Battery']
  },
  {
    id: 'w2',
    name: 'Titan Watch Ultra',
    price: 799.99,
    description: 'The most capable smartwatch for extreme environments. Rugged, bold, and powerful.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    category: 'Wearables',
    features: ['Sapphire Glass', 'Dual-Band GPS', '100m Water Resist', 'Action Button']
  },
  {
    id: 'w3',
    name: 'Vision Glass AR',
    price: 499.99,
    description: 'Augmented reality in a familiar form factor. Information at your fingertips, literally.',
    image: 'https://images.unsplash.com/photo-1592477976530-fa670719d8d4?auto=format&fit=crop&q=80&w=800',
    category: 'Wearables',
    features: ['Micro-OLED', 'Hand Tracking', 'Lightweight', 'Voice Control']
  },
  {
    id: 'w4',
    name: 'Pulse Band 5',
    price: 49.99,
    description: 'Simple, effective fitness tracking. Everything you need to stay active and healthy.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=800',
    category: 'Wearables',
    features: ['SpO2 Monitor', '14-Day Battery', 'Swim Proof', 'Stress Tracking']
  },
  {
    id: 'w5',
    name: 'Zenith Smart Glasses',
    price: 299.99,
    description: 'Audio-focused smart eyewear. Listen to your favorite tracks while staying present.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    category: 'Wearables',
    features: ['Open-ear Audio', 'Polarized Lenses', 'UV Protection', 'Built-in Mic']
  },

  // FURNITURE CATEGORY
  {
    id: '4',
    name: 'Aero Desk 2.0',
    price: 599.99,
    description: 'The future of ergonomic work. Minimalist design meets maximum functionality.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
    category: 'Furniture',
    features: ['Height Adjustable', 'Cable Management', 'Carbon Fiber Finish']
  },
  {
    id: 'f2',
    name: 'Ergo Throne X',
    price: 449.99,
    description: 'Unmatched comfort for long hours. Adaptive lumbar support and breathable mesh.',
    image: 'https://images.unsplash.com/photo-1505797149-43b0076649d6?auto=format&fit=crop&q=80&w=800',
    category: 'Furniture',
    features: ['Lumbar Support', '4D Armrests', 'Breathable Mesh', 'Recline Lock']
  },
  {
    id: 'f3',
    name: 'Lumina Smart Lamp',
    price: 149.99,
    description: 'More than just a light. Wireless charging and smart home integration built-in.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    category: 'Furniture',
    features: ['Qi Charging', 'App Control', 'Dimmable', 'Sleep Timer']
  },
  {
    id: 'f4',
    name: 'Modu Sofa System',
    price: 1299.99,
    description: 'Modular comfort that grows with you. Reconfigure your space in seconds.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    category: 'Furniture',
    features: ['Stain Resistant', 'Modular Design', 'Hidden Storage', 'Eco-friendly']
  },
  {
    id: 'f5',
    name: 'Zen Bookshelf',
    price: 249.99,
    description: 'Minimalist storage for your favorite reads. Solid oak and steel construction.',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800',
    category: 'Furniture',
    features: ['Solid Oak', 'Steel Frame', 'Easy Assembly', 'Anti-tip Kit']
  }
];
