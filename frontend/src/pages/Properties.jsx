import React, { useState, useEffect } from 'react';
import { PropertyCard } from '../components/properties/PropertyCard';
import { PropertyFilters } from '../components/properties/PropertyFilters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { propertiesAPI } from '../api/properties';
import { motion } from 'framer-motion';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    bhk: '',
    minRent: '',
    maxRent: '',
    city: '',
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.bhk) params.bhk = filters.bhk;
      if (filters.minRent) params.minRent = filters.minRent;
      if (filters.maxRent) params.maxRent = filters.maxRent;
      if (filters.city) params.city = filters.city;

      const response = await propertiesAPI.getAll(params);
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = () => {
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Properties
          </h1>
          <p className="text-gray-600">
            Find your perfect rental home from thousands of verified properties
          </p>
        </motion.div>

        {/* Filters */}
        <PropertyFilters
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
        />

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-gray-900">{properties.length}</span>{' '}
              {properties.length === 1 ? 'property' : 'properties'}
            </p>
          </div>
        )}

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onFavoriteToggle={fetchProperties}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to find more properties
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Properties;
