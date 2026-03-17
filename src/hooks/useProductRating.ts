import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function useProductRating(productId: string) {
  const [rating, setRating] = useState({ average: 0, count: 0 });

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => doc.data());
      if (reviews.length > 0) {
        const sum = reviews.reduce((acc, curr: any) => acc + curr.rating, 0);
        setRating({
          average: sum / reviews.length,
          count: reviews.length
        });
      } else {
        setRating({ average: 0, count: 0 });
      }
    });

    return () => unsubscribe();
  }, [productId]);

  return rating;
}
