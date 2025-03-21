import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight text-white hover:text-red-500 transition-all"
        >
          AI Content Studio
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 flex items-center">
          <Link
            to="/"
            className="text-lg font-medium hover:text-red-500 transition-all"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/features"
                className="text-lg font-medium hover:text-red-500 transition-all"
              >
                Features
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-lg font-medium hover:text-red-500 transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-lg font-medium hover:text-red-500 transition-all"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
