# House Rent API

A production-ready REST API for a long-term house rental platform built with Node.js, Express, TypeScript, and MongoDB. This platform connects property owners with tenants looking for monthly/yearly rentals.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based auth with role-based access control (Tenant, Owner, Admin)
- **Property Management**: Full CRUD operations for property listings with advanced search and filtering
- **Visit Requests**: Tenants can request property visits; owners can accept/reject
- **Rental Applications**: Formal application system for tenants to apply for properties
- **Favorites/Wishlist**: Save favorite properties for later viewing
- **Search & Filtering**: Advanced search by location, price range, BHK, furnishing, amenities, etc.
- **Pagination & Sorting**: Efficient data retrieval with pagination support
- **Security**: Input sanitization, rate limiting, helmet security headers, CORS
- **Validation**: Comprehensive request validation using Zod schemas
- **Testing**: Integration tests with Jest and Supertest

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: Helmet, CORS, bcrypt, express-rate-limit
- **Testing**: Jest, Supertest, MongoDB Memory Server
- **Code Quality**: ESLint, Prettier

## 📁 Project Structure

```
HouseRentApi/
├── src/
│   ├── config/
│   │   ├── database.ts       # MongoDB connection
│   │   └── env.ts            # Environment variable validation
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── property.controller.ts
│   │   ├── visitRequest.controller.ts
│   │   ├── application.controller.ts
│   │   └── favorite.controller.ts
│   ├── middlewares/
│   │   ├── auth.ts           # Authentication & authorization
│   │   ├── errorHandler.ts   # Centralized error handling
│   │   ├── rateLimiter.ts    # Rate limiting
│   │   └── validate.ts       # Request validation
│   ├── models/
│   │   ├── User.ts
│   │   ├── Property.ts
│   │   ├── VisitRequest.ts
│   │   ├── RentalApplication.ts
│   │   ├── RentalAgreement.ts
│   │   └── Favorite.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── property.routes.ts
│   │   ├── visitRequest.routes.ts
│   │   ├── application.routes.ts
│   │   ├── favorite.routes.ts
│   │   └── index.ts
│   ├── tests/
│   │   ├── setup.ts
│   │   ├── auth.test.ts
│   │   └── property.test.ts
│   ├── utils/
│   │   ├── ApiError.ts       # Custom error classes
│   │   ├── ApiResponse.ts    # Response formatters
│   │   ├── jwt.ts            # JWT utilities
│   │   └── sanitize.ts       # Input sanitization
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   ├── property.validation.ts
│   │   ├── visitRequest.validation.ts
│   │   └── application.validation.ts
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── jest.config.js
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/house-rent-api

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# API Configuration
API_VERSION=v1
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd HouseRentApi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

### Running the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Build for production**:
```bash
npm run build
```

**Run production build**:
```bash
npm start
```

**Run tests**:
```bash
npm test
```

**Run tests in watch mode**:
```bash
npm run test:watch
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```http
GET /api/v1/health
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |
| PATCH | `/users/me` | Update profile | Private |
| PATCH | `/users/me/role` | Convert to owner | Private |

### Property Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/properties` | Create property | Owner |
| GET | `/properties` | Search properties | Public |
| GET | `/properties/:id` | Get property details | Public |
| GET | `/owner/properties` | Get owner's properties | Owner |
| PATCH | `/properties/:id` | Update property | Owner |
| DELETE | `/properties/:id` | Delete property | Owner |

### Visit Request Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/properties/:id/visit-requests` | Request visit | Private |
| GET | `/visit-requests/me` | Get my requests | Private |
| GET | `/owner/visit-requests` | Get received requests | Owner |
| PATCH | `/visit-requests/:id` | Update status | Owner |

### Rental Application Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/properties/:id/applications` | Submit application | Private |
| GET | `/applications/me` | Get my applications | Private |
| GET | `/owner/applications` | Get received applications | Owner |
| PATCH | `/applications/:id` | Update status | Owner |

### Favorites Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/properties/:id/favorite` | Add to favorites | Private |
| DELETE | `/properties/:id/favorite` | Remove from favorites | Private |
| GET | `/favorites` | Get favorites | Private |

For detailed request/response examples, see [API_EXAMPLES.md](./API_EXAMPLES.md).

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🎭 User Roles

- **Tenant** (default): Can search properties, request visits, submit applications, save favorites
- **Owner**: All tenant permissions + can create and manage properties, respond to requests
- **Admin**: Full access to all resources

## 🔍 Search & Filtering

The property search endpoint supports multiple filters:

- **Location**: `city`, `area`
- **Price**: `minRent`, `maxRent`
- **Property details**: `bhk`, `furnishing`, `propertyType`
- **Preferences**: `allowedTenants`, `petsAllowed`
- **Sorting**: `newest`, `rent_low_to_high`, `rent_high_to_low`
- **Pagination**: `page`, `limit`

Example:
```
GET /api/v1/properties?city=Mumbai&bhk=2&minRent=20000&maxRent=40000&page=1&limit=10
```

## 🧪 Testing

The project includes comprehensive integration tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

Tests cover:
- Authentication flow (register, login, profile management)
- Property CRUD operations
- Search and filtering
- Authorization checks
- Input validation

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents brute force attacks
- **Input Sanitization**: Prevents NoSQL injection and XSS
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Request Validation**: Zod schemas for all endpoints

## 📈 Future Enhancements

The codebase is designed to be easily extended with:

- ✨ **Payment Integration**: Rent payments and security deposits
- 📧 **Email Verification**: Email confirmation for new users
- 📄 **Digital Agreements**: E-signature for rental agreements
- 🔍 **KYC Verification**: Identity verification for users
- 🖼️ **Image Upload**: Cloud storage integration (AWS S3, Cloudinary)
- 📊 **Analytics**: Property views, application statistics
- 💬 **Messaging**: Direct chat between tenants and owners
- 🔔 **Notifications**: Email/SMS notifications for updates
- 🌐 **Geolocation**: Map-based property search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For questions or issues, please open an issue on the repository.

---

**Built with ❤️ for the rental community**
