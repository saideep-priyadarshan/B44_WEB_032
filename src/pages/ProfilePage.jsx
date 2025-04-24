import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ref, onValue } from "firebase/database";
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

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

    const bookPromises = borrowedBookIds.map(bookId => {
      return new Promise((resolve, reject) => {
        const bookRef = ref(db, `books/${bookId}`);
        onValue(bookRef, (snapshot) => {
          if (snapshot.exists()) {
            resolve({ id: bookId, ...snapshot.val() });
          } else {
            resolve(null);
          }
        }, reject, { onlyOnce: true });
      });
    });

    Promise.all(bookPromises)
      .then(results => {
        setBorrowedBookDetails(results.filter(book => book !== null));
        setLoadingBooks(false);
      })
      .catch(error => {
        console.error("Error fetching borrowed book details:", error);
        setLoadingBooks(false);
      });

  }, [userData]);

  if (!currentUser || !userData) {
    return <p className="text-center p-10">Loading profile...</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="mb-6 space-y-2">
        <p><span className="font-semibold">Name:</span> {userData.name || 'N/A'}</p>
        <p><span className="font-semibold">Email:</span> {currentUser.email}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4 border-t pt-4">Borrowed Books</h2>
      {loadingBooks && <p>Loading borrowed books...</p>}
      {!loadingBooks && borrowedBookDetails.length === 0 && (
        <p className="text-gray-500">You haven't borrowed any books yet.</p>
      )}
      {!loadingBooks && borrowedBookDetails.length > 0 && (
        <ul className="space-y-3">
          {borrowedBookDetails.map(book => (
            <li key={book.id} className="border p-3 rounded flex justify-between items-center">
               <div>
                <Link to={`/books/${book.id}`} className="font-semibold text-indigo-600 hover:underline">{book.title}</Link>
                <p className="text-sm text-gray-600">by {book.author}</p>
                {book.dueDate && (
                     <p className="text-sm text-red-600">Due: {format(new Date(book.dueDate), 'MMM dd, yyyy')}</p>
                )}
              </div>
               <Link
                 to={`/books/${book.id}`}
                 className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
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