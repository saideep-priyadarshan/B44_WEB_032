import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="text-indigo-600 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;