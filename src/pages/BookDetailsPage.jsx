import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ref, onValue, update, set } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { format, addDays } from "date-fns";
import AverageRating from "../components/AverageRating";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import SocialShare from "../components/SocialShare";

const BookDetailsPage = () => {
  const { bookId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    const bookRef = ref(db, `books/${bookId}`);

    const unsubscribe = onValue(
      bookRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setBook(snapshot.val());
        } else {
          setError("Book not found.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [bookId]);

  const handleBorrow = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (book?.status !== "available") return;

    setActionLoading(true);
    setError("");
    const dueDate = format(addDays(new Date(), 14), "yyyy-MM-dd");

    const updates = {};
    updates[`/books/${bookId}/status`] = "borrowed";
    updates[`/books/${bookId}/borrowedBy`] = currentUser.uid;
    updates[`/books/${bookId}/dueDate`] = dueDate;
    updates[`/users/${currentUser.uid}/borrowedBooks/${bookId}`] = true;

    try {
      await update(ref(db), updates);
    } catch (err) {
      console.error("Error borrowing book:", err);
      setError("Failed to borrow book. Please try again.");
    }
    setActionLoading(false);
  };

  const handleReturn = async () => {
    if (!currentUser || book?.borrowedBy !== currentUser.uid) {
      return;
    }

    setActionLoading(true);
    setError("");

    const updates = {};
    updates[`/books/${bookId}/status`] = "available";
    updates[`/books/${bookId}/borrowedBy`] = null;
    updates[`/books/${bookId}/dueDate`] = null;
    updates[`/users/${currentUser.uid}/borrowedBooks/${bookId}`] = null;

    try {
      await update(ref(db), updates);
    } catch (err) {
      console.error("Error returning book:", err);
      setError("Failed to return book. Please try again.");
    }
    setActionLoading(false);
  };

  if (loading)
    return <p className="text-center p-10">Loading book details...</p>;
  if (error) return <p className="text-center text-red-600 p-10">{error}</p>;
  if (!book) return <p className="text-center p-10">Book not found.</p>;

  const isBorrowedByCurrentUser =
    book.status === "borrowed" && book.borrowedBy === currentUser?.uid;

  if (!book && !loading && !error) {
    return <p className="text-center p-10">Book data not available.</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      {book && !loading && !error && (
        <>
          {book.coverUrl && (
            <img
              src={book.coverUrl}
              alt={`Cover for ${book.title}`}
              className="w-32 h-48 object-cover rounded shadow-md float-right ml-6 mb-4"
            />
          )}
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {book.title}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            by {book.author}
          </p>
          <div className="mb-4">
            <AverageRating bookId={bookId} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            ISBN: {book.isbn || "N/A"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Status:{" "}
            <span
              className={`font-medium ${
                book.status === "available"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {book.status}
            </span>
            {book.status === "borrowed" && book.dueDate && (
              <span className="ml-2 text-gray-500">
                (Due: {format(new Date(book.dueDate), "MMM dd, yyyy")})
              </span>
            )}
          </p>

          {book.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-6 mt-4 clear-right">
              {book.description}
            </p>
          )}

          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          {currentUser && book.status === "available" && (
            <button
              onClick={handleBorrow}
              disabled={actionLoading}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {actionLoading ? "Borrowing..." : "Borrow Book"}
            </button>
          )}

          {isBorrowedByCurrentUser && (
            <button
              onClick={handleReturn}
              disabled={actionLoading}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {actionLoading ? "Returning..." : "Return Book"}
            </button>
          )}

          {!currentUser && book.status === "available" && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>{" "}
              to borrow this book.
            </p>
          )}

          {book.status === "borrowed" && !isBorrowedByCurrentUser && (
            <p className="text-sm text-red-600 mt-4">
              This book is currently borrowed.
            </p>
          )}
          <SocialShare bookTitle={book.title} bookUrl={window.location.href} />
          <ReviewList bookId={bookId} />
          <ReviewForm bookId={bookId} />
        </>
      )}
    </div>
  );
};

export default BookDetailsPage;
