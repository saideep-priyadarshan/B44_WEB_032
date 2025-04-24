import { Link } from 'react-router-dom';

const BookCard = ({ book, id }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'borrowed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-white">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
         <p className="text-xs text-gray-500 mb-3">ISBN: {book.isbn || 'N/A'}</p>
        <div className="flex justify-between items-center">
           <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(book.status)}`}>
            {book.status}
          </span>
           <Link
             to={`/books/${id}`}
             className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
           >
             Details
           </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;