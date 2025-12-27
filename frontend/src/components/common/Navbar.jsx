import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { 
  HomeIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <HomeIcon className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              House<span className="text-blue-600">Rent</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/properties"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Browse Properties
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'owner' && (
                  <Link
                    to="/add-property"
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Property
                  </Link>
                )}
                
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  Dashboard
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-4"
          >
            <Link
              to="/properties"
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Properties
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'owner' && (
                  <Link
                    to="/add-property"
                    className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Add Property
                  </Link>
                )}
                
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};
