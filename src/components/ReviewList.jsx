import { useState, useEffect } from "react";
import {
  ref,
  onValue,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { db } from "../firebase";
import StarRating from "./StarRating";
import { formatDistanceToNow } from "date-fns";

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reviewsRef = ref(db, `reviews/${bookId}`);
    const reviewsQuery = query(
      reviewsRef,
      orderByChild("timestamp"),
      limitToLast(10)
    );

    const unsubscribe = onValue(
      reviewsQuery,
      (snapshot) => {
        const reviewsData = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            reviewsData.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
          setReviews(reviewsData.reverse());
        } else {
          setReviews([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [bookId]);

  if (loading) {
    return (
      <p className="mt-6 text-gray-600 dark:text-gray-400">
        Loading reviews...
      </p>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="mt-6 text-gray-500 dark:text-gray-400">
        No reviews yet. Be the first!
      </p>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Recent Reviews ({reviews.length})
      </h3>
      <ul className="space-y-6">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {review.userName || "Anonymous"}
              </span>
              {review.timestamp && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(review.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
            <div className="mb-2">
              <StarRating rating={review.rating} size="h-4 w-4" />
            </div>
            {review.text && (
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {review.text}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
