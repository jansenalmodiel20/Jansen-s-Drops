import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Send, User as UserIcon, Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { db, auth, signInWithPopup, googleProvider } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

interface ReviewSystemProps {
  productId: string;
  user: any | null;
}

export const ReviewSystem: React.FC<ReviewSystemProps> = ({ productId, user }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
      setIsLoading(false);
    }, (err) => {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp()
      });

      setComment('');
      setRating(5);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review.');
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="mt-24 py-24 border-t border-white/5">
      <div className="grid lg:grid-cols-3 gap-16">
        {/* Review Summary */}
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-display font-bold mb-6 tracking-tighter uppercase">Customer Reviews</h2>
          
          <div className="glass p-8 rounded-[32px] border border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl font-bold text-neon-cyan">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex text-neon-cyan mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.round(averageRating) ? "currentColor" : "none"} 
                      className={i < Math.round(averageRating) ? "" : "text-white/20"}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Based on {reviews.length} reviews</p>
              </div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-4 text-xs">
                    <span className="w-3 text-white/40">{star}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full bg-neon-cyan"
                      />
                    </div>
                    <span className="w-8 text-right text-white/20">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Review Form & List */}
        <div className="lg:col-span-2">
          {/* Form */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Write a Review</h3>
            {user ? (
              <form onSubmit={handleSubmit} className="glass p-8 rounded-[32px] border border-white/5">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Your Rating</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          fill={star <= rating ? "#00FFFF" : "none"} 
                          className={star <= rating ? "text-neon-cyan" : "text-white/20"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm focus:border-neon-cyan outline-none transition-all min-h-[120px] resize-none"
                    required
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-red-400 text-xs mb-6 bg-red-400/10 p-4 rounded-xl border border-red-400/20"
                    >
                      <AlertCircle size={14} />
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-emerald-400 text-xs mb-6 bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20"
                    >
                      <CheckCircle2 size={14} />
                      Review submitted successfully!
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-neon-cyan text-off-black px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 neon-glow-cyan"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  Post Review
                </button>
              </form>
            ) : (
              <div className="glass p-12 rounded-[32px] border border-white/5 text-center">
                <p className="text-white/40 text-sm mb-6">Please log in to share your thoughts on this product.</p>
                <button 
                  onClick={handleLogin}
                  className="text-neon-cyan text-xs font-bold uppercase tracking-widest border border-neon-cyan/20 px-6 py-3 rounded-xl hover:bg-neon-cyan/10 transition-all"
                >
                  Sign In to Review
                </button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Recent Feedback</h3>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="text-neon-cyan animate-spin" size={32} />
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-8 rounded-[32px] border border-white/5 relative group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{review.userName}</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">
                          {review.createdAt?.toDate().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-neon-cyan">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < review.rating ? "currentColor" : "none"} 
                          className={i < review.rating ? "" : "text-white/20"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{review.comment}</p>
                  
                  {user && user.uid === review.userId && (
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="absolute top-8 right-8 p-2 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 glass rounded-[32px] border border-white/5">
                <p className="text-white/20 text-sm italic">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
