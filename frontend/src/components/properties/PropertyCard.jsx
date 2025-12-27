import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  HomeIcon,
  CurrencyRupeeIcon,
  HeartIcon as HeartOutline,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../utils/formatters';
import { propertiesAPI } from '../../api/properties';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export const PropertyCard = ({ property, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = React.useState(property.isFavorite || false);
  const [loading, setLoading] = React.useState(false);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await propertiesAPI.removeFavorite(property._id);
        toast.success('Removed from favorites');
      } else {
        await propertiesAPI.addFavorite(property._id);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
      onFavoriteToggle?.();
    } catch (error) {
      console.error('Favorite toggle error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/properties/${property._id}`)}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images?.[0] || 'https://via.placeholder.com/400x300'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          disabled={loading}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          {isFavorite ? (
            <HeartSolid className="w-6 h-6 text-red-500" />
          ) : (
            <HeartOutline className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              property.status === 'available'
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {property.status === 'available' ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPinIcon className="w-5 h-5" />
          <span className="text-sm line-clamp-1">
            {property.location?.address}, {property.location?.city}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <HomeIcon className="w-5 h-5" />
              <span>{property.bhk} BHK</span>
            </div>
            <div>
              <span>{property.propertyType}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <div className="flex items-center gap-1 text-2xl font-bold text-blue-600">
              <CurrencyRupeeIcon className="w-6 h-6" />
              <span>{formatCurrency(property.rent).replace('₹', '')}</span>
            </div>
            <p className="text-xs text-gray-500">per month</p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/properties/${property._id}`);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};
