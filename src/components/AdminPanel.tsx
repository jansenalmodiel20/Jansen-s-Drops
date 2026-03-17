import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  Filter, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  ArrowLeft, 
  Loader2, 
  ChevronDown,
  Mail,
  User as UserIcon,
  Users as UsersIcon,
  UserCog,
  Plus,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  updateDoc, 
  doc, 
  Timestamp,
  where,
  getDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../constants';

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
  userEmail?: string;
  userName?: string;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // Fetch all users
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList: UserProfile[] = [];
      const userMap: Record<string, UserProfile> = {};
      
      usersSnap.forEach(doc => {
        const userData = doc.data() as UserProfile;
        usersList.push(userData);
        userMap[doc.id] = userData;
      });
      setUsers(usersList);

      // Fetch all orders
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const userId = data.userId;
        return {
          id: doc.id,
          ...data,
          userEmail: userMap[userId]?.email || 'Unknown',
          userName: userMap[userId]?.displayName || 'Anonymous'
        } as Order;
      });
      setOrders(ordersData);

      // Fetch products
      const productsSnap = await getDocs(collection(db, 'products'));
      let productsList = productsSnap.docs.map(doc => doc.data() as Product);
      
      // Seed products if empty
      if (productsList.length === 0) {
        for (const p of DEFAULT_PRODUCTS) {
          await setDoc(doc(db, 'products', p.id), p);
        }
        productsList = DEFAULT_PRODUCTS;
      }
      setProducts(productsList);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: UserProfile['role']) => {
    setUpdatingId(userId);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      
      setUsers(prev => prev.map(user => 
        user.uid === userId ? { ...user, role: newRole } : user
      ));
      
      // Also update orders mapping if necessary (though it's derived)
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.uid.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setUpdatingId(editingProduct.id);
    try {
      await setDoc(doc(db, 'products', editingProduct.id), editingProduct);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setUpdatingId(productId);
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'shipped': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-neon-cyan animate-spin" size={48} />
        <p className="text-white/40 text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Command Center</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-black pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 uppercase text-[10px] font-bold tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Store
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neon-cyan/10 rounded-2xl flex items-center justify-center text-neon-cyan border border-neon-cyan/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold tracking-tighter uppercase">Admin Panel</h1>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">System Management v1.1</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text"
                placeholder={activeTab === 'orders' ? "Search orders, users, emails..." : "Search users, emails, UIDs..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:border-neon-cyan outline-none transition-all w-full md:w-80"
              />
            </div>
            {activeTab === 'orders' && (
              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm focus:border-neon-cyan outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/5 pb-4">
          <button 
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'orders' ? 'bg-neon-cyan text-off-black neon-glow-cyan' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package size={16} /> Orders
          </button>
          <button 
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'users' ? 'bg-neon-cyan text-off-black neon-glow-cyan' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <UsersIcon size={16} /> Users
          </button>
          <button 
            onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'products' ? 'bg-neon-cyan text-off-black neon-glow-cyan' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package size={16} /> Products
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' ? (
              <motion.div 
                key="orders-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <motion.div 
                      key={order.id}
                      layout
                      className="glass p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Order Info */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-neon-cyan">
                              <Package size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Order ID</p>
                              <p className="text-sm font-mono font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/20 text-[10px] uppercase font-bold tracking-tighter">
                            <Clock size={12} />
                            {order.createdAt?.toDate().toLocaleString()}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="lg:col-span-3 border-l border-white/5 pl-6">
                          <div className="flex items-center gap-3 mb-1">
                            <UserIcon size={14} className="text-white/40" />
                            <p className="text-sm font-bold truncate">{order.userName}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail size={14} className="text-white/40" />
                            <p className="text-xs text-white/40 truncate">{order.userEmail}</p>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="lg:col-span-2 border-l border-white/5 pl-6">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Items</p>
                          <p className="text-sm font-bold">{order.items.length} Products</p>
                          <p className="text-lg font-display font-bold text-neon-cyan mt-1">${order.total.toFixed(2)}</p>
                        </div>

                        {/* Status & Actions */}
                        <div className="lg:col-span-4 flex flex-col sm:flex-row items-center justify-end gap-4">
                          <div className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                            {order.status}
                          </div>
                          
                          <div className="flex gap-2">
                            {order.status !== 'shipped' && order.status !== 'delivered' && (
                              <button 
                                onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                disabled={updatingId === order.id}
                                className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-colors disabled:opacity-50"
                                title="Mark as Shipped"
                              >
                                {updatingId === order.id ? <Loader2 className="animate-spin" size={18} /> : <Truck size={18} />}
                              </button>
                            )}
                            {order.status !== 'delivered' && (
                              <button 
                                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                disabled={updatingId === order.id}
                                className="p-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-colors disabled:opacity-50"
                                title="Mark as Delivered"
                              >
                                {updatingId === order.id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass p-20 rounded-[40px] flex flex-col items-center justify-center text-center">
                    <AlertCircle size={40} className="text-white/10 mb-4" />
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white/40">No orders found</h3>
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'users' ? (
              <motion.div 
                key="users-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <motion.div 
                      key={user.uid}
                      layout
                      className="glass p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* User Identity */}
                        <div className="lg:col-span-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden glass p-0.5">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-full">
                                <UserIcon size={20} className="text-white/20" />
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-bold truncate">{user.displayName || 'Anonymous'}</p>
                            <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                          </div>
                        </div>

                        {/* User Metadata */}
                        <div className="lg:col-span-3 border-l border-white/5 pl-6">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">UID</p>
                          <p className="text-[10px] font-mono text-white/60 truncate">{user.uid}</p>
                          <p className="text-[10px] text-white/20 mt-1">Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                        </div>

                        {/* Role Status */}
                        <div className="lg:col-span-2 border-l border-white/5 pl-6">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Current Role</p>
                          <div className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                            user.role === 'admin' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-white/40'
                          }`}>
                            {user.role}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-3 flex justify-end gap-2">
                          <button 
                            onClick={() => handleRoleUpdate(user.uid, user.role === 'admin' ? 'user' : 'admin')}
                            disabled={updatingId === user.uid}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                              user.role === 'admin' 
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                                : 'bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20'
                            }`}
                          >
                            {updatingId === user.uid ? (
                              <Loader2 className="animate-spin" size={14} />
                            ) : (
                              <>
                                <UserCog size={14} />
                                {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass p-20 rounded-[40px] flex flex-col items-center justify-center text-center">
                    <AlertCircle size={40} className="text-white/10 mb-4" />
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white/40">No users found</h3>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="products-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Product List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="glass rounded-[32px] overflow-hidden border border-white/5 group relative">
                      <div className="aspect-video relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="p-3 bg-white text-off-black rounded-xl hover:scale-110 transition-transform"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <span className="text-neon-cyan font-bold">${product.price}</span>
                        </div>
                        <p className="text-xs text-white/40 uppercase tracking-widest">{product.category}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Product Button */}
                  <button 
                    onClick={() => setEditingProduct({
                      id: `prod-${Date.now()}`,
                      name: '',
                      price: 0,
                      description: '',
                      image: '',
                      category: 'Tech',
                      features: [],
                      images: [],
                      videoUrl: ''
                    })}
                    className="glass rounded-[32px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-neon-cyan/50 transition-colors min-h-[200px]"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                      <Plus size={24} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Add New Product</span>
                  </button>
                </div>

                {/* Edit Modal */}
                <AnimatePresence>
                  {editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditingProduct(null)}
                        className="absolute inset-0 bg-off-black/80 backdrop-blur-sm"
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl glass rounded-[40px] border border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
                      >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                          <h2 className="text-2xl font-display font-bold uppercase">Edit Product</h2>
                          <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                            <X size={24} />
                          </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="p-8 overflow-y-auto space-y-8">
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="space-y-6">
                              <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Product Name</label>
                                <input 
                                  type="text"
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-neon-cyan outline-none"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Price ($)</label>
                                  <input 
                                    type="number"
                                    value={editingProduct.price}
                                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-neon-cyan outline-none"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Category</label>
                                  <select 
                                    value={editingProduct.category}
                                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-neon-cyan outline-none appearance-none"
                                  >
                                    <option value="Tech">Tech</option>
                                    <option value="Audio">Audio</option>
                                    <option value="Wearables">Wearables</option>
                                    <option value="Furniture">Furniture</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Description</label>
                                <textarea 
                                  value={editingProduct.description}
                                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-neon-cyan outline-none min-h-[100px] resize-none"
                                  required
                                />
                              </div>
                            </div>

                            {/* Media */}
                            <div className="space-y-6">
                              <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block flex items-center gap-2">
                                  <ImageIcon size={14} /> Main Image URL
                                </label>
                                <input 
                                  type="text"
                                  value={editingProduct.image}
                                  onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-neon-cyan outline-none"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block flex items-center gap-2">
                                  <Video size={14} /> Video Sample URL (Optional)
                                </label>
                                <input 
                                  type="text"
                                  value={editingProduct.videoUrl || ''}
                                  onChange={(e) => setEditingProduct({...editingProduct, videoUrl: e.target.value})}
                                  placeholder="https://example.com/video.mp4"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-neon-cyan outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Additional Images (One per line)</label>
                                <textarea 
                                  value={(editingProduct.images || []).join('\n')}
                                  onChange={(e) => setEditingProduct({...editingProduct, images: e.target.value.split('\n').filter(url => url.trim())})}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-neon-cyan outline-none min-h-[100px] resize-none"
                                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
                            <button 
                              type="button"
                              onClick={() => setEditingProduct(null)}
                              className="px-8 py-4 glass rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              disabled={updatingId === editingProduct.id}
                              className="px-8 py-4 bg-neon-cyan text-off-black rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-transform neon-glow-cyan disabled:opacity-50"
                            >
                              {updatingId === editingProduct.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
