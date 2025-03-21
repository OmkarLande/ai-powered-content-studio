import React from "react";
import { Link } from "react-router-dom";
import { Home, Settings, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="text-2xl font-bold text-red-500 hover:text-red-600 transition-all"
          >
            AI Content Studio
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" Icon={Home} label="Home" />
            <NavLink to="/features" Icon={Settings} label="Features" />
            <NavLink to="/login" Icon={LogIn} label="Login" />
            <NavLink to="/signup" Icon={UserPlus} label="Signup" />
          </div>

          {/* Mobile Menu (Optional) */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Reusable NavLink Component
const NavLink = ({ to, Icon, label }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-lg text-gray-700 hover:text-red-500 transition-all"
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

// Mobile Menu (Optional)
const MobileMenu = () => (
  <div className="relative">
    <button className="text-gray-700 hover:text-red-500">☰</button>
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
      <LinkItem to="/" label="Home" />
      <LinkItem to="/features" label="Features" />
      <LinkItem to="/login" label="Login" />
      <LinkItem to="/signup" label="Signup" />
    </div>
  </div>
);

const LinkItem = ({ to, label }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition-all"
  >
    {label}
  </Link>
);

export default Navbar;
