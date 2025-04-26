import { Link } from "react-router-dom";
import AverageRating from "./AverageRating";

const BookCard = ({ book, id }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50";
      case "borrowed":
        return "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-xl dark:hover:shadow-indigo-900/30 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 flex flex-col">
      {book.coverUrl && (
        <Link to={`/books/${id}`} className="block h-48 overflow-hidden">
          <img
            src={book.coverUrl}
            alt={`Cover for ${book.title}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      )}
      {!book.coverUrl && (
        <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
          No Cover
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-1 truncate text-gray-800 dark:text-gray-100">
          {book.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          by {book.author}
        </p>
        <div className="mb-3">
          <AverageRating bookId={id} />
        </div>

        <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(
              book.status
            )}`}
          >
            {book.status}
          </span>
          <Link
            to={`/books/${id}`}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
