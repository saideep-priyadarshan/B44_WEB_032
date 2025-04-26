import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const ProfilePage = () => {
  const { currentUser, userData } = useAuth();
  const [borrowedBookDetails, setBorrowedBookDetails] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    if (!userData || !userData.borrowedBooks) {
      setBorrowedBookDetails([]);
      setLoadingBooks(false);
      return;
    }

    setLoadingBooks(true);
    const borrowedBookIds = Object.keys(userData.borrowedBooks);

    if (borrowedBookIds.length === 0) {
      setBorrowedBookDetails([]);
      setLoadingBooks(false);
      return;
    }

    const bookPromises = borrowedBookIds.map((bookId) => {
      return new Promise((resolve, reject) => {
        const bookRef = ref(db, `books/${bookId}`);
        onValue(
          bookRef,
          (snapshot) => {
            if (snapshot.exists()) {
              resolve({ id: bookId, ...snapshot.val() });
            } else {
              resolve(null);
            }
          },
          reject,
          { onlyOnce: true }
        );
      });
    });

    Promise.all(bookPromises)
      .then((results) => {
        setBorrowedBookDetails(results.filter((book) => book !== null));
        setLoadingBooks(false);
      })
      .catch((error) => {
        console.error("Error fetching borrowed book details:", error);
        setLoadingBooks(false);
      });
  }, [userData]);

  if (!currentUser || !userData) {
    return <p className="text-center p-10">Loading profile...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-b pb-3 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
        Your Profile
      </h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
          Account Details
        </h2>
        <p>
          <span className="font-semibold">Name:</span> {userData.name || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {currentUser.email}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 border-t pt-6 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
        Currently Borrowed Books
      </h2>
      {loadingBooks && <p>Loading borrowed books...</p>}
      {!loadingBooks && borrowedBookDetails.length === 0 && (
        <p className="text-gray-500">You haven't borrowed any books yet.</p>
      )}
      {!loadingBooks && borrowedBookDetails.length > 0 && (
        <ul className="space-y-3">
          {borrowedBookDetails.map((book) => (
            <li
              key={book.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <Link
                  to={`/books/${book.id}`}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {book.title}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {book.author}
                </p>
                {book.dueDate && (
                  <p className="text-sm text-red-600">
                    Due: {format(new Date(book.dueDate), "MMM dd, yyyy")}
                  </p>
                )}
              </div>
              <Link
                to={`/books/${book.id}`}
                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow hover:shadow-lg"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfilePage;
