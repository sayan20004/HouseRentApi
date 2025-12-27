import React from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export const PropertyFilters = ({ filters, setFilters, onSearch }) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const propertyTypes = ['apartment', 'villa', 'house', 'pg', 'studio'];
  const bhkOptions = [1, 2, 3, 4, 5];

  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleReset = () => {
    setFilters({
      search: '',
      propertyType: '',
      bhk: '',
      minRent: '',
      maxRent: '',
      city: '',
    });
    onSearch();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Main Search */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by location, title..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={onSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Search
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-semibold flex items-center gap-2"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t"
        >
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* BHK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
            <select
              value={filters.bhk}
              onChange={(e) => handleChange('bhk', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Any</option>
              {bhkOptions.map((bhk) => (
                <option key={bhk} value={bhk}>
                  {bhk} BHK
                </option>
              ))}
            </select>
          </div>

          {/* Min Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Rent
            </label>
            <input
              type="number"
              placeholder="₹ 0"
              value={filters.minRent}
              onChange={(e) => handleChange('minRent', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Max Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Rent
            </label>
            <input
              type="number"
              placeholder="₹ Any"
              value={filters.maxRent}
              onChange={(e) => handleChange('maxRent', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <XMarkIcon className="w-5 h-5" />
              Reset Filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
