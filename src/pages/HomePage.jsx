import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="text-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Welcome to Online Book Library
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-noto">
        Discover your next favorite book. Browse our collection, borrow
        instantly, and share your thoughts with the community.
      </p>
      <Link
        to="/catalog"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow hover:shadow-lg"
      >
        Explore the Catalog
      </Link>
    </div>
  );
};

export default HomePage;
