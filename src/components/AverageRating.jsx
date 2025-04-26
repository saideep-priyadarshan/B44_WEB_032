import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import StarRating from "./StarRating";

const AverageRating = ({ bookId }) => {
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reviewsRef = ref(db, `reviews/${bookId}`);
    const unsubscribe = onValue(
      reviewsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const reviewsData = snapshot.val();
          const ratings = Object.values(reviewsData).map(
            (review) => review.rating
          );
          if (ratings.length > 0) {
            const sum = ratings.reduce((acc, cur) => acc + cur, 0);
            setAverage(sum / ratings.length);
            setCount(ratings.length);
          } else {
            setAverage(0);
            setCount(0);
          }
        } else {
          setAverage(0);
          setCount(0);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reviews for average:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [bookId]);

  if (loading) {
    return (
      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    );
  }

  if (count === 0) {
    return (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        No ratings yet
      </span>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <StarRating rating={average} />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        ({average.toFixed(1)} avg. from {count} reviews)
      </span>
    </div>
  );
};

export default AverageRating;
