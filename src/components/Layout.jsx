import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 layout">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600 footer">
        Online Book Library &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Layout;
