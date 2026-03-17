import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Camera, Save, ArrowLeft, Loader2, CheckCircle2, Package, Clock, ChevronRight } from 'lucide-react';
import { db, User } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: Timestamp;
}

interface UserProfilePageProps {
  user: User;
  onBack: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onBack }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user data
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setDisplayName(data.displayName || '');
          setPhotoURL(data.photoURL || '');
        }

        // Fetch orders
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef, 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.uid]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        photoURL,
        updatedAt: new Date().toISOString()
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-black flex items-center justify-center">
        <Loader2 className="text-neon-cyan animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-black pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 uppercase text-xs font-bold tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Store
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 rounded-[40px] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-electric-purple to-neon-cyan" />
          
          <div className="flex flex-col items-center mb-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-2 border-white/10 overflow-hidden mb-4 glass p-1">
                {photoURL ? (
                  <img 
                    src={photoURL} 
                    alt={displayName} 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-full">
                    <UserIcon size={48} className="text-white/20" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 right-0 w-10 h-10 bg-neon-cyan rounded-full flex items-center justify-center text-off-black shadow-lg border-4 border-off-black">
                <Camera size={18} />
              </div>
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tighter uppercase">Account Settings</h1>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-2">Manage your digital identity</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Display Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-neon-cyan outline-none transition-colors" 
                placeholder="Your Name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Profile Photo URL</label>
              <input 
                type="url" 
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-neon-cyan outline-none transition-colors" 
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-[10px] text-white/20 ml-4 italic">Provide a direct link to an image (JPEG, PNG, etc.)</p>
            </div>

            <div className="space-y-2 opacity-50">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Email Address</label>
              <input 
                type="email" 
                value={user.email || ''} 
                disabled 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 cursor-not-allowed" 
              />
            </div>

            <button 
              type="submit"
              disabled={isSaving}
              className="w-full py-5 bg-neon-cyan text-off-black font-bold rounded-2xl flex items-center justify-center gap-2 mt-8 text-lg neon-glow-cyan disabled:opacity-50 transition-all active:scale-95"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Save size={20} /> Save Changes
                </>
              )}
            </button>
          </form>

          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl"
            >
              <CheckCircle2 size={20} /> Profile Updated Successfully
            </motion.div>
          )}
        </motion.div>

        {/* Order History Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-display font-bold tracking-tighter uppercase">Order History</h2>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">{orders.length} Orders</span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="glass p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-cyan">
                        <Package size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold uppercase tracking-tight">Order #{order.id.slice(-6).toUpperCase()}</p>
                          <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                            order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/40 text-[10px] mt-1">
                          <Clock size={10} />
                          <span>{order.createdAt?.toDate().toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8">
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Amount</p>
                        <p className="text-lg font-display font-bold text-neon-cyan">${order.total.toFixed(2)}</p>
                      </div>
                      <ChevronRight className="text-white/20 group-hover:text-neon-cyan transition-colors" size={20} />
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="text-[10px] text-white/60 truncate">
                        <span className="font-bold text-white/80">{item.quantity}x</span> {item.name}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="text-[10px] text-white/30 italic">
                        + {order.items.length - 4} more items
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass p-12 rounded-[40px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/10 mb-4">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white/40">No orders yet</h3>
              <p className="text-xs text-white/20 max-w-[200px] mt-2">Your digital drops will appear here once you make a purchase.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
