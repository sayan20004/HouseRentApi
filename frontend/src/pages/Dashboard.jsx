import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  HeartIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { propertiesAPI } from '../api/properties';
import { applicationsAPI } from '../api/applications';
import { visitRequestsAPI } from '../api/visitRequests';
import { PropertyCard } from '../components/properties/PropertyCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDateTime } from '../utils/formatters';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    favorites: [],
    applications: [],
    visitRequests: [],
    ownerProperties: [],
    ownerApplications: [],
    ownerVisitRequests: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'tenant') {
        const [favorites, applications, visitRequests] = await Promise.all([
          propertiesAPI.getFavorites(),
          applicationsAPI.getAll(),
          visitRequestsAPI.getAll(),
        ]);
        setData({
          ...data,
          favorites: favorites.data || [],
          applications: applications.data || [],
          visitRequests: visitRequests.data || [],
        });
      } else if (user?.role === 'owner') {
        const [ownerProperties, ownerApplications, ownerVisitRequests] = await Promise.all([
          propertiesAPI.getOwnerProperties(),
          applicationsAPI.getOwnerApplications(),
          visitRequestsAPI.getOwnerRequests(),
        ]);
        setData({
          ...data,
          ownerProperties: ownerProperties.data || [],
          ownerApplications: ownerApplications.data || [],
          ownerVisitRequests: ownerVisitRequests.data || [],
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatusUpdate = async (id, status) => {
    try {
      await applicationsAPI.updateStatus(id, status);
      toast.success(`Application ${status}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleVisitRequestStatusUpdate = async (id, status) => {
    try {
      await visitRequestsAPI.updateStatus(id, status);
      toast.success(`Visit request ${status}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating visit request:', error);
    }
  };

  const tabs = user?.role === 'tenant' 
    ? [
        { id: 'overview', label: 'Overview', icon: HomeIcon },
        { id: 'favorites', label: 'Favorites', icon: HeartIcon },
        { id: 'applications', label: 'Applications', icon: DocumentTextIcon },
        { id: 'visits', label: 'Visit Requests', icon: CalendarIcon },
        { id: 'profile', label: 'Profile', icon: UserCircleIcon },
      ]
    : [
        { id: 'overview', label: 'Overview', icon: HomeIcon },
        { id: 'properties', label: 'My Properties', icon: HomeIcon },
        { id: 'applications', label: 'Applications', icon: DocumentTextIcon },
        { id: 'visits', label: 'Visit Requests', icon: CalendarIcon },
        { id: 'profile', label: 'Profile', icon: UserCircleIcon },
      ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {user?.role === 'tenant' ? (
                <>
                  <StatCard
                    title="Favorites"
                    value={data.favorites.length}
                    icon={HeartIcon}
                    color="red"
                  />
                  <StatCard
                    title="Applications"
                    value={data.applications.length}
                    icon={DocumentTextIcon}
                    color="blue"
                  />
                  <StatCard
                    title="Visit Requests"
                    value={data.visitRequests.length}
                    icon={CalendarIcon}
                    color="green"
                  />
                </>
              ) : (
                <>
                  <StatCard
                    title="My Properties"
                    value={data.ownerProperties.length}
                    icon={HomeIcon}
                    color="blue"
                  />
                  <StatCard
                    title="Applications"
                    value={data.ownerApplications.length}
                    icon={DocumentTextIcon}
                    color="purple"
                  />
                  <StatCard
                    title="Visit Requests"
                    value={data.ownerVisitRequests.length}
                    icon={CalendarIcon}
                    color="green"
                  />
                  <div
                    onClick={() => navigate('/add-property')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center flex-col text-white"
                  >
                    <PlusCircleIcon className="w-12 h-12 mb-2" />
                    <p className="font-semibold">Add Property</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Favorites Tab (Tenant) */}
          {activeTab === 'favorites' && user?.role === 'tenant' && (
            <div>
              {data.favorites.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.favorites.map((fav) => (
                    <PropertyCard key={fav._id} property={fav.property} onFavoriteToggle={fetchDashboardData} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={HeartIcon}
                  title="No Favorites Yet"
                  description="Start adding properties to your favorites"
                  actionText="Browse Properties"
                  onAction={() => navigate('/properties')}
                />
              )}
            </div>
          )}

          {/* Properties Tab (Owner) */}
          {activeTab === 'properties' && user?.role === 'owner' && (
            <div>
              {data.ownerProperties.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.ownerProperties.map((property) => (
                    <div key={property._id} className="relative">
                      <PropertyCard property={property} />
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          onClick={() => navigate(`/edit-property/${property._id}`)}
                          className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-50 transition-colors font-semibold text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={HomeIcon}
                  title="No Properties Listed"
                  description="Start listing your properties"
                  actionText="Add Property"
                  onAction={() => navigate('/add-property')}
                />
              )}
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              {(user?.role === 'tenant' ? data.applications : data.ownerApplications).length > 0 ? (
                (user?.role === 'tenant' ? data.applications : data.ownerApplications).map((application) => (
                  <motion.div
                    key={application._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {application.property?.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{application.property?.location?.city}</p>
                        {user?.role === 'owner' && (
                          <p className="text-gray-600">Applicant: {application.tenant?.name}</p>
                        )}
                        <p className="text-sm text-gray-500">Applied on: {formatDateTime(application.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            application.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : application.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {application.status}
                        </span>
                        {user?.role === 'owner' && application.status === 'pending' && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleApplicationStatusUpdate(application._id, 'approved')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleApplicationStatusUpdate(application._id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <EmptyState
                  icon={DocumentTextIcon}
                  title="No Applications"
                  description={user?.role === 'tenant' ? 'You haven\'t applied to any properties yet' : 'No applications received yet'}
                />
              )}
            </div>
          )}

          {/* Visit Requests Tab */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              {(user?.role === 'tenant' ? data.visitRequests : data.ownerVisitRequests).length > 0 ? (
                (user?.role === 'tenant' ? data.visitRequests : data.ownerVisitRequests).map((visit) => (
                  <motion.div
                    key={visit._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {visit.property?.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{visit.property?.location?.city}</p>
                        {user?.role === 'owner' && (
                          <p className="text-gray-600">Requested by: {visit.tenant?.name}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Visit scheduled for: {formatDateTime(visit.visitDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            visit.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : visit.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : visit.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {visit.status}
                        </span>
                        {user?.role === 'owner' && visit.status === 'pending' && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleVisitRequestStatusUpdate(visit._id, 'approved')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVisitRequestStatusUpdate(visit._id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <EmptyState
                  icon={CalendarIcon}
                  title="No Visit Requests"
                  description={user?.role === 'tenant' ? 'You haven\'t scheduled any visits yet' : 'No visit requests received yet'}
                />
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="text-lg font-semibold text-gray-900">{user?.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    red: 'from-red-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-r ${colorClasses[color]} rounded-2xl shadow-lg p-6 text-white`}
    >
      <Icon className="w-10 h-10 mb-4 opacity-80" />
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="opacity-90">{title}</p>
    </motion.div>
  );
};

const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Dashboard;
