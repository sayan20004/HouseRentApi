# 🏠 House Rent - Complete Setup Guide

## ✅ Complete Feature List

### 🎨 **Beautiful Landing Page**
- Animated hero section with gradient backgrounds
- Property statistics showcase
- Feature highlights with icons
- "How It Works" step-by-step guide
- Customer testimonials
- Call-to-action sections
- Fully responsive design

### 👤 **Authentication System**
- User Registration (Tenant/Owner)
- User Login
- JWT-based authentication
- Persistent auth state with Zustand
- Protected routes

### 🏘️ **Property Features**

#### For Tenants:
- ✅ Browse all properties
- ✅ Advanced search and filters
  - Search by location, title
  - Filter by property type (apartment, villa, house, PG, studio)
  - Filter by BHK (1-5)
  - Filter by rent range
- ✅ View detailed property information
- ✅ Image gallery with preview
- ✅ Add/remove favorites (saved properties)
- ✅ Schedule property visits
- ✅ Submit rental applications
- ✅ Track application status (pending/approved/rejected)
- ✅ Track visit request status

#### For Property Owners:
- ✅ Add new properties with:
  - Title, description
  - Property type, BHK, furnishing
  - Rent, security deposit, area
  - Full address details
  - Maintenance information
  - Multiple amenities selection
  - Upload up to 5 images
- ✅ Edit existing properties
- ✅ Delete properties
- ✅ Mark properties as available/rented
- ✅ View all property listings
- ✅ Receive and manage rental applications
- ✅ Approve/reject applications
- ✅ Receive and manage visit requests
- ✅ Approve/reject visit requests

### 📊 **Dashboard**
- Personalized dashboard for tenants and owners
- Overview statistics
- Favorites management (tenants)
- My properties management (owners)
- Applications tracking
- Visit requests tracking
- User profile information

### 🎯 **UI/UX Features**
- ⚡ Smooth animations with Framer Motion
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Beautiful gradients and modern design
- 🔔 Toast notifications for user feedback
- ⏳ Loading states for all async operations
- ✨ Hover effects and transitions
- 🎭 Empty states with helpful messages
- 🖼️ Image upload with preview
- 📸 Image gallery with selection

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

1. **Navigate to frontend directory:**
```bash
cd /Users/sayanmaity/Desktop/HouseRentApi/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### API Endpoint
The frontend is configured to use your production API:
- **API URL:** `https://houserentapi.onrender.com/api/v1`

Located in: `src/api/axios.js`

### Environment Variables (Optional)
Create `.env` file if you want to customize:
```env
VITE_API_URL=https://houserentapi.onrender.com/api/v1
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API integration layer
│   │   ├── axios.js          # Axios configuration
│   │   ├── auth.js           # Auth API calls
│   │   ├── properties.js     # Property API calls
│   │   ├── applications.js   # Application API calls
│   │   └── visitRequests.js  # Visit request API calls
│   │
│   ├── components/       # Reusable components
│   │   ├── common/           # Common UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── properties/       # Property components
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyFilters.jsx
│   │   │   └── PropertyDetail.jsx
│   │   └── auth/             # Auth components
│   │       ├── LoginForm.jsx
│   │       └── RegisterForm.jsx
│   │
│   ├── pages/            # Page components
│   │   ├── Landing.jsx       # Landing page
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Register page
│   │   ├── Properties.jsx    # Property listing
│   │   ├── PropertyDetails.jsx # Property details
│   │   ├── Dashboard.jsx     # User dashboard
│   │   ├── AddProperty.jsx   # Add property (owners)
│   │   └── EditProperty.jsx  # Edit property (owners)
│   │
│   ├── store/            # State management
│   │   └── authStore.js      # Auth state (Zustand)
│   │
│   ├── utils/            # Utility functions
│   │   └── formatters.js     # Format helpers
│   │
│   ├── App.jsx           # Main app with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
│
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Utility-first CSS |
| **Framer Motion** | Animation library |
| **Zustand** | State management |
| **Axios** | HTTP client |
| **React Hot Toast** | Toast notifications |
| **Heroicons** | Icon library |
| **TanStack Query** | Data fetching (configured) |
| **date-fns** | Date formatting |

## 🎨 Key Features Implementation

### 1. **Authentication Flow**
- JWT token stored in localStorage
- Zustand store for auth state persistence
- Protected routes for authenticated users
- Automatic token injection in API calls
- Auto-redirect on 401 errors

### 2. **Property Management**
- Image upload with preview
- Multi-select amenities
- Dynamic form validation
- Real-time search and filters
- Pagination ready (backend support)

### 3. **User Experience**
- Smooth page transitions
- Loading skeletons
- Error handling with user-friendly messages
- Responsive design for all screen sizes
- Accessibility considerations

### 4. **Performance**
- Code splitting with React.lazy (ready)
- Optimized images
- Efficient re-renders
- Memoization where needed

## 📱 Pages Overview

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| **Landing** | `/` | Public | Homepage with hero, features, testimonials |
| **Login** | `/login` | Public | User login form |
| **Register** | `/register` | Public | User registration (tenant/owner) |
| **Properties** | `/properties` | Public | Browse and search properties |
| **Property Details** | `/properties/:id` | Public | Detailed property view |
| **Dashboard** | `/dashboard` | Protected | User dashboard |
| **Add Property** | `/add-property` | Owner only | Create new property listing |
| **Edit Property** | `/edit-property/:id` | Owner only | Edit existing property |

## 🔐 User Roles

### Tenant
- Browse properties
- Save favorites
- Apply to properties
- Schedule visits
- Track applications

### Owner
- List properties
- Manage listings
- Review applications
- Approve/reject visits
- Update property status

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add property comparison feature
- [ ] Implement chat between tenant and owner
- [ ] Add property reviews and ratings
- [ ] Email notifications
- [ ] Advanced analytics for owners
- [ ] Payment integration
- [ ] PDF generation for agreements
- [ ] Google Maps integration
- [ ] Social media sharing
- [ ] SEO optimization

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API connection issues
- Verify backend is running
- Check API URL in `src/api/axios.js`
- Check browser console for CORS errors

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Support

For issues or questions:
1. Check the console for errors
2. Verify API is accessible
3. Check network tab in browser DevTools
4. Review component error boundaries

---

**Built with ❤️ using React + Vite + Tailwind CSS**
