import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { propertiesAPI } from '../api/properties';
import toast from 'react-hot-toast';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    bhk: 1,
    furnishing: 'unfurnished',
    rent: '',
    securityDeposit: '',
    builtUpArea: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    maintenanceAmount: '',
    maintenanceType: 'monthly',
    amenities: [],
    status: 'available',
  });

  const propertyTypes = ['apartment', 'villa', 'house', 'pg', 'studio'];
  const furnishingTypes = ['unfurnished', 'semi-furnished', 'fully-furnished'];
  const bhkOptions = [1, 2, 3, 4, 5];
  const amenitiesList = [
    'parking',
    'gym',
    'swimming-pool',
    'garden',
    'power-backup',
    'lift',
    'security',
    'water-supply',
    'internet',
    'ac',
    'modular-kitchen',
    'balcony',
  ];

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertiesAPI.getById(id);
      const property = response.data;
      
      setFormData({
        title: property.title,
        description: property.description,
        propertyType: property.propertyType,
        bhk: property.bhk,
        furnishing: property.furnishing,
        rent: property.rent,
        securityDeposit: property.securityDeposit,
        builtUpArea: property.builtUpArea,
        address: property.location.address,
        city: property.location.city,
        state: property.location.state,
        pincode: property.location.pincode,
        maintenanceAmount: property.maintenance?.amount || '',
        maintenanceType: property.maintenance?.type || 'monthly',
        amenities: property.amenities || [],
        status: property.status,
      });
      
      setExistingImages(property.images || []);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Property not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + existingImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        bhk: parseInt(formData.bhk),
        furnishing: formData.furnishing,
        rent: parseFloat(formData.rent),
        securityDeposit: parseFloat(formData.securityDeposit),
        builtUpArea: parseFloat(formData.builtUpArea),
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        maintenance: {
          amount: parseFloat(formData.maintenanceAmount) || 0,
          type: formData.maintenanceType,
        },
        amenities: formData.amenities,
        status: formData.status,
      };

      await propertiesAPI.update(id, updateData);
      toast.success('Property updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating property:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await propertiesAPI.delete(id);
      toast.success('Property deleted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Property</h1>
          <p className="text-gray-600">Update your property details</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Status */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none capitalize"
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HomeIcon className="w-6 h-6 text-blue-600" />
              Basic Information
            </h2>

            <div className="space-y-6">
              <Input
                label="Property Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Spacious 3 BHK Apartment"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows="4"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none capitalize"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type} className="capitalize">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BHK <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {bhkOptions.map((bhk) => (
                      <option key={bhk} value={bhk}>
                        {bhk} BHK
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnishing <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none capitalize"
                  >
                    {furnishingTypes.map((type) => (
                      <option key={type} value={type} className="capitalize">
                        {type.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Input
                  label="Monthly Rent"
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  placeholder="25000"
                  icon={CurrencyRupeeIcon}
                  required
                />

                <Input
                  label="Security Deposit"
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="50000"
                  icon={CurrencyRupeeIcon}
                  required
                />

                <Input
                  label="Built Up Area (sq.ft)"
                  type="number"
                  name="builtUpArea"
                  value={formData.builtUpArea}
                  onChange={handleChange}
                  placeholder="1200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPinIcon className="w-6 h-6 text-blue-600" />
              Location
            </h2>

            <div className="space-y-6">
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                required
              />

              <div className="grid md:grid-cols-3 gap-6">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  required
                />

                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  required
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  required
                />
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Maintenance</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Maintenance Amount"
                type="number"
                name="maintenanceAmount"
                value={formData.maintenanceAmount}
                onChange={handleChange}
                placeholder="2000"
                icon={CurrencyRupeeIcon}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Type
                </label>
                <select
                  name="maintenanceType"
                  value={formData.maintenanceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none capitalize"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="included">Included in Rent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`py-3 px-4 rounded-lg border-2 transition-all text-sm font-medium capitalize ${
                    formData.amenities.includes(amenity)
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {amenity.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              className="px-6"
            >
              Delete Property
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Update Property
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditProperty;
