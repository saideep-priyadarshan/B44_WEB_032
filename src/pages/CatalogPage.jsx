import { useState, useEffect } from "react";
import {
  ref,
  onValue,
  query,
  orderByChild,
  startAt,
  endAt,
} from "firebase/database";
import { db } from "../firebase";
import BookCard from "../components/BookCard";

const CatalogPage = () => {
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const booksRef = ref(db, "books");
    let booksQuery = booksRef;

    const unsubscribe = onValue(
      booksQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          setBooks(snapshot.val());
        } else {
          setBooks({});
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching books:", err);
        setError("Failed to load books.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredBooks = Object.entries(books).filter(([id, book]) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      book.title?.toLowerCase().includes(lowerSearchTerm) ||
      book.author?.toLowerCase().includes(lowerSearchTerm)
    );
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
        Book Catalog
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Find your next read. Search by title or author below.
      </p>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {loading && <p className="text-center">Loading books...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && filteredBooks.length === 0 && (
        <p className="text-center text-gray-500">
          No books found matching your criteria.
        </p>
      )}

      {!loading && !error && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map(([id, book]) => (
            <BookCard key={id} id={id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
