import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l9 4.9v9.8L12 22l-9-5.3V6.9L12 2z" />
              </svg>
              <span className="ml-2 font-bold text-lg text-gray-800">HFT Bot Platform</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/bots/create" className="text-gray-600 hover:text-indigo-600 font-medium">Create Bot</Link>
            <Link to="/bots/list" className="text-gray-600 hover:text-indigo-600 font-medium">My Bots</Link>
            <Link to="/exchange/accounts" className="text-gray-600 hover:text-indigo-600 font-medium">Exchange Accounts</Link>
            {user ? (
              <Link to="/settings" className="text-gray-600 hover:text-indigo-600 font-medium">Settings</Link>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
            )}
          </div>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/register" className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition">
                Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="focus:outline-none">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-2">
          <Link to="/bots/create" className="block px-4 py-2 text-gray-700 hover:text-indigo-600">Create Bot</Link>
          <Link to="/bots/list" className="block px-4 py-2 text-gray-700 hover:text-indigo-600">My Bots</Link>
          <Link to="/exchange/accounts" className="block px-4 py-2 text-gray-700 hover:text-indigo-600">Exchange Accounts</Link>
          {user && (
            <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:text-indigo-600">Settings</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:text-indigo-600">Logout</button>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-2 text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="block px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md text-center">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
