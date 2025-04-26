import { useState } from "react";
import { Link } from "react-router-dom";
import { ref, push, serverTimestamp, set } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

const ReviewForm = ({ bookId }) => {
  const { currentUser, userData } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !userData) {
      setError("You must be logged in to submit a review.");
      return;
    }
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setLoading(true);
    setError("");
    setSubmitted(false);

    const reviewsRef = ref(db, `reviews/${bookId}`);
    const newReviewRef = push(reviewsRef);

    try {
      await set(newReviewRef, {
        userId: currentUser.uid,
        userName: userData.name || currentUser.email,
        rating: rating,
        text: text,
        timestamp: serverTimestamp(),
      });
      setRating(0);
      setText("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
        Please{" "}
        <Link
          to="/login"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          log in
        </Link>{" "}
        to leave a review.
      </p>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Leave a Review
      </h3>
      {submitted && (
        <p className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-3 rounded mb-4 text-sm">
          Review submitted successfully!
        </p>
      )}
      {error && (
        <p className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded mb-4 text-sm">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Rating:
          </label>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  type="button"
                  key={starValue}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRating(starValue)}
                  className="focus:outline-none"
                  aria-label={`Rate ${starValue} out of 5 stars`}
                >
                  <StarSolid
                    className={`h-7 w-7 transition-colors ${
                      (hoverRating || rating) >= starValue
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="reviewText"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Your Review (Optional):
          </label>
          <textarea
            id="reviewText"
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Share your thoughts about the book..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
