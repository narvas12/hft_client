import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LOGO from '../../assets/images/logo.png'; 

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
    <nav className="bg-oxblood-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-500">
                <img src={LOGO} alt=""  className='rounded-full'/>
              </div>
              <span className="ml-3 font-bold text-xl text-yellow-400">HFT BOT</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-900 hover:text-yellow-400 font-medium transition duration-200"
            >
              Create Bot
            </Link>
            <Link 
              to="/bots/list" 
              className="text-gray-900 hover:text-yellow-400 font-medium transition duration-200"
            >
              My Bots
            </Link>
            <Link 
              to="/exchange/accounts" 
              className="text-gray-900 hover:text-yellow-400 font-medium transition duration-200"
            >
              Exchange Accounts
            </Link>
            {user && (
              <Link 
                to="/settings" 
                className="text-gray-900 hover:text-yellow-400 font-medium transition duration-200"
              >
                Settings
              </Link>
            )}
          </div>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <span className="text-gray-900">Welcome, <span className="text-yellow-400">{user.username}</span></span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-oxblood-900 bg-yellow-500 hover:bg-yellow-600 rounded-md shadow transition duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-900 hover:text-yellow-400 font-medium transition duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-oxblood-900 bg-yellow-500 hover:bg-yellow-600 rounded-md shadow transition duration-200 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="focus:outline-none p-1 rounded-md text-gray-900 hover:text-yellow-400 hover:bg-oxblood-800 transition duration-200"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-oxblood-800 shadow-xl`}>
        <div className="px-2 pt-2 pb-4 space-y-2">
          <Link 
            to="/bots/create" 
            className="block px-4 py-3 text-gray-900 hover:text-yellow-400 hover:bg-oxblood-700 rounded-md transition duration-200"
            onClick={toggleMobileMenu}
          >
            Create Bot
          </Link>
          <Link 
            to="/bots/list" 
            className="block px-4 py-3 text-gray-900 hover:text-yellow-400 hover:bg-oxblood-700 rounded-md transition duration-200"
            onClick={toggleMobileMenu}
          >
            My Bots
          </Link>
          <Link 
            to="/exchange/accounts" 
            className="block px-4 py-3 text-gray-900 hover:text-yellow-400 hover:bg-oxblood-700 rounded-md transition duration-200"
            onClick={toggleMobileMenu}
          >
            Exchange Accounts
          </Link>
          {user && (
            <Link 
              to="/settings" 
              className="block px-4 py-3 text-gray-900 hover:text-yellow-400 hover:bg-oxblood-700 rounded-md transition duration-200"
              onClick={toggleMobileMenu}
            >
              Settings
            </Link>
          )}
          {user ? (
            <button 
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }} 
              className="w-full text-left px-4 py-3 text-gray-900 hover:text-yellow-400 hover:bg-oxblood-700 rounded-md transition duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block px-4 py-3 text-gray-900 hover:text-yellow-400 hover:bg-oxblood-700 rounded-md transition duration-200"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="block px-4 py-3 text-center text-oxblood-900 bg-yellow-500 hover:bg-yellow-600 rounded-md shadow transition duration-200 font-medium"
                onClick={toggleMobileMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;