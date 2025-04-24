import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold mb-4">Welcome to the Library!</h1>
    <p>Browse our <Link to="/catalog" className="text-indigo-600 hover:underline">catalog</Link>.</p>
  </div>
);

export default HomePage;