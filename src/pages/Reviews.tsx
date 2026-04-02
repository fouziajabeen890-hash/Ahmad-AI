import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Star, MessageSquare, Send, User as UserIcon } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const path = 'reviews';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !comment.trim()) return;

    setIsSubmitting(true);
    const path = 'reviews';
    try {
      const reviewData: any = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous Student',
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, path), reviewData);
      setComment('');
      setRating(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-indigo-500" />
            Course Reviews
          </h1>
          <p className="text-slate-400 font-light">Share your experience and read what other students think about the Python course.</p>
        </div>

        {/* Write a Review Section */}
        <div className="glass-panel rounded-3xl p-8 mb-10 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Write a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none shadow-inner transition-all"
                placeholder="How was your experience with the course? Did it help you learn Python?"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:from-indigo-600 disabled:to-purple-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white mb-6">Student Reviews ({reviews.length})</h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-light">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="glass-panel rounded-2xl p-6 sm:p-8 transition-all hover:border-white/20 hover:shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      <UserIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200">{review.userName}</h3>
                      <p className="text-xs text-slate-500">
                        {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-light">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
