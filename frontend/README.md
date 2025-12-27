# House Rent Frontend

A modern, beautiful React frontend for the House Rent API with smooth animations and excellent UX.

## Features

- 🎨 Beautiful landing page with smooth animations
- 🔐 User authentication (Login/Register)
- 🏠 Property listing with advanced filters
- ❤️ Favorite properties
- 📝 Apply to properties
- 📅 Schedule property visits
- 👤 User dashboard (Tenant & Owner)
- 📱 Fully responsive design
- ⚡ Fast and snappy performance

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - API calls
- **React Hot Toast** - Notifications
- **Heroicons** - Icons

## Getting Started

### Prerequisites

- Node.js >= 18
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API integration
│   ├── components/       # Reusable components
│   │   ├── common/       # Common UI components
│   │   ├── properties/   # Property-related components
│   │   └── auth/         # Authentication components
│   ├── pages/            # Page components
│   ├── store/            # Zustand store
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
└── index.html            # HTML template
```

## Features Implemented

### For Tenants
- Browse and search properties
- Filter by type, BHK, rent range
- View detailed property information
- Add properties to favorites
- Schedule property visits
- Submit rental applications
- Track application status

### For Property Owners
- List properties with images
- Manage property listings
- View and manage applications
- Approve/reject visit requests
- Track property performance

## API Integration

The frontend connects to the backend API at `/api/v1`. All endpoints are configured in the `src/api/` directory.

## Styling

The app uses Tailwind CSS with custom animations and gradients for a modern, polished look. All components are fully responsive and optimized for mobile devices.

## State Management

Uses Zustand for lightweight state management with persistent storage for authentication.

## License

MIT
