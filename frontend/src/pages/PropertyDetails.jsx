import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  HomeIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  HeartIcon as HeartOutline,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { propertiesAPI } from '../api/properties';
import { visitRequestsAPI } from '../api/visitRequests';
import { applicationsAPI } from '../api/applications';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertiesAPI.getById(id);
      setProperty(response.data);
      setIsFavorite(response.data.isFavorite || false);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Property not found');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await propertiesAPI.removeFavorite(property._id);
        toast.success('Removed from favorites');
      } else {
        await propertiesAPI.addFavorite(property._id);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favorite toggle error:', error);
    }
  };

  const handleScheduleVisit = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to schedule visit');
      navigate('/login');
      return;
    }

    if (!visitDate || !visitTime) {
      toast.error('Please select date and time');
      return;
    }

    try {
      await visitRequestsAPI.create(property._id, {
        visitDate: new Date(`${visitDate}T${visitTime}`),
      });
      toast.success('Visit request sent successfully');
      setShowVisitModal(false);
      setVisitDate('');
      setVisitTime('');
    } catch (error) {
      console.error('Visit request error:', error);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    try {
      await applicationsAPI.create(property._id, {
        message: 'I am interested in renting this property.',
      });
      toast.success('Application submitted successfully');
      setShowApplicationModal(false);
    } catch (error) {
      console.error('Application error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="relative h-96">
            <img
              src={property.images?.[selectedImage] || 'https://via.placeholder.com/800x600'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              {isFavorite ? (
                <HeartSolid className="w-6 h-6 text-red-500" />
              ) : (
                <HeartOutline className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
          
          {property.images && property.images.length > 1 && (
            <div className="p-4 flex gap-4 overflow-x-auto">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer transition-all ${
                    selectedImage === index ? 'ring-4 ring-blue-600' : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="w-5 h-5" />
                    <span>
                      {property.location?.address}, {property.location?.city}, {property.location?.state} - {property.location?.pincode}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-3xl font-bold text-blue-600">
                    <CurrencyRupeeIcon className="w-8 h-8" />
                    <span>{formatCurrency(property.rent).replace('₹', '')}</span>
                  </div>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{property.propertyType}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">BHK</p>
                  <p className="font-semibold text-gray-900">{property.bhk} BHK</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Area</p>
                  <p className="font-semibold text-gray-900">{property.builtUpArea} sq.ft</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Furnishing</p>
                  <p className="font-semibold text-gray-900 capitalize">{property.furnishing}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700 capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Security Deposit</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(property.securityDeposit)}</p>
                </div>
                {property.maintenance && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-sm mb-1">Maintenance</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(property.maintenance.amount)} ({property.maintenance.type})
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interested in this property?</h3>
              
              <div className="space-y-3">
                <Button
                  fullWidth
                  onClick={() => setShowVisitModal(true)}
                  variant="outline"
                >
                  <CalendarIcon className="w-5 h-5" />
                  Schedule Visit
                </Button>
                
                <Button fullWidth onClick={() => setShowApplicationModal(true)}>
                  <HomeIcon className="w-5 h-5" />
                  Apply Now
                </Button>
              </div>

              {property.owner && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Owner</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{property.owner.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span>{property.owner.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Visit Modal */}
        {showVisitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule a Visit</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" fullWidth onClick={() => setShowVisitModal(false)}>
                    Cancel
                  </Button>
                  <Button fullWidth onClick={handleScheduleVisit}>
                    Confirm
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Application Modal */}
        {showApplicationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Apply for Property</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to apply for this property? The owner will review your application.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => setShowApplicationModal(false)}>
                  Cancel
                </Button>
                <Button fullWidth onClick={handleApply}>
                  Submit Application
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;
