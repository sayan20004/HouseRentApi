# API Usage Examples

Detailed request/response examples for all API endpoints.

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

### 1. Register User

**Register as Tenant (default)**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

**Register as Owner**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543211",
    "password": "password123",
    "role": "owner"
  }'
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "tenant",
      "isEmailVerified": false,
      "kycStatus": "not_submitted",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "tenant",
      "isEmailVerified": false,
      "kycStatus": "not_submitted",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### 3. Get Current User Profile

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Update Profile

```bash
curl -X PATCH http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "phone": "9999999999"
  }'
```

### 5. Convert Tenant to Owner

```bash
curl -X PATCH http://localhost:5000/api/v1/users/me/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "confirmRole": "owner"
  }'
```

---

## Properties

### 1. Create Property (Owner Only)

```bash
curl -X POST http://localhost:5000/api/v1/properties \
  -H "Authorization: Bearer OWNER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful 2BHK Apartment in Downtown Mumbai",
    "description": "A spacious 2BHK apartment with modern amenities, perfect for families. Located in the heart of downtown with easy access to public transport, schools, and shopping centers.",
    "propertyType": "apartment",
    "bhk": 2,
    "furnishing": "fully_furnished",
    "rent": 35000,
    "securityDeposit": 70000,
    "maintenance": {
      "amount": 3000,
      "included": false
    },
    "builtUpArea": 1200,
    "availableFrom": "2024-02-01",
    "minLockInPeriodMonths": 11,
    "allowedTenants": "family",
    "petsAllowed": true,
    "smokingAllowed": false,
    "location": {
      "city": "Mumbai",
      "area": "Bandra West",
      "landmark": "Near Linking Road",
      "pincode": "400050",
      "geo": {
        "lat": 19.0596,
        "lng": 72.8295
      }
    },
    "amenities": ["Parking", "Lift", "Security", "Power Backup", "Gym", "Swimming Pool"],
    "images": [
      "https://example.com/images/property1-living.jpg",
      "https://example.com/images/property1-bedroom.jpg",
      "https://example.com/images/property1-kitchen.jpg"
    ]
  }'
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "owner": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "9876543211"
    },
    "title": "Beautiful 2BHK Apartment in Downtown Mumbai",
    "propertyType": "apartment",
    "bhk": 2,
    "furnishing": "fully_furnished",
    "rent": 35000,
    "location": {
      "city": "Mumbai",
      "area": "Bandra West"
    },
    "status": "active",
    "createdAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Property created successfully"
}
```

### 2. Get Owner's Properties

```bash
curl -X GET http://localhost:5000/api/v1/owner/properties \
  -H "Authorization: Bearer OWNER_JWT_TOKEN"
```

### 3. Search Properties (Public)

**Basic search**
```bash
curl -X GET "http://localhost:5000/api/v1/properties"
```

**Search with filters**
```bash
curl -X GET "http://localhost:5000/api/v1/properties?city=Mumbai&bhk=2&minRent=20000&maxRent=50000&furnishing=fully_furnished&petsAllowed=true&page=1&limit=10&sortBy=rent_low_to_high"
```

**Query Parameters:**
- `city` - Filter by city
- `area` - Filter by area
- `minRent` - Minimum rent amount
- `maxRent` - Maximum rent amount
- `bhk` - Number of bedrooms
- `furnishing` - unfurnished | semi_furnished | fully_furnished
- `propertyType` - apartment | independent_house | pg | studio | shared_flat
- `allowedTenants` - family | bachelors | students | any
- `petsAllowed` - true | false
- `sortBy` - newest | rent_low_to_high | rent_high_to_low
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "Beautiful 2BHK Apartment",
      "rent": 35000,
      "bhk": 2,
      "furnishing": "fully_furnished",
      "location": {
        "city": "Mumbai",
        "area": "Bandra West"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 47
  }
}
```

### 4. Get Property Details

```bash
curl -X GET http://localhost:5000/api/v1/properties/65a1b2c3d4e5f6g7h8i9j0k2
```

### 5. Update Property (Owner Only)

```bash
curl -X PATCH http://localhost:5000/api/v1/properties/65a1b2c3d4e5f6g7h8i9j0k2 \
  -H "Authorization: Bearer OWNER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rent": 38000,
    "status": "active"
  }'
```

### 6. Delete Property (Owner Only)

```bash
curl -X DELETE http://localhost:5000/api/v1/properties/65a1b2c3d4e5f6g7h8i9j0k2 \
  -H "Authorization: Bearer OWNER_JWT_TOKEN"
```

---

## Visit Requests

### 1. Create Visit Request

```bash
curl -X POST http://localhost:5000/api/v1/properties/65a1b2c3d4e5f6g7h8i9j0k2/visit-requests \
  -H "Authorization: Bearer TENANT_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferredDateTime": "2024-01-20T15:00:00Z",
    "notes": "I would like to visit the property on Saturday afternoon. Please confirm if this works for you."
  }'
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "property": "65a1b2c3d4e5f6g7h8i9j0k2",
    "tenant": "65a1b2c3d4e5f6g7h8i9j0k1",
    "owner": "65a1b2c3d4e5f6g7h8i9j0k0",
    "preferredDateTime": "2024-01-20T15:00:00.000Z",
    "status": "pending",
    "notes": "I would like to visit...",
    "createdAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Visit request created successfully"
}
```

### 2. Get Tenant's Visit Requests

```bash
curl -X GET http://localhost:5000/api/v1/visit-requests/me \
  -H "Authorization: Bearer TENANT_JWT_TOKEN"
```

### 3. Get Owner's Visit Requests

```bash
curl -X GET http://localhost:5000/api/v1/owner/visit-requests \
  -H "Authorization: Bearer OWNER_JWT_TOKEN"
```

### 4. Update Visit Request Status (Owner Only)

```bash
curl -X PATCH http://localhost:5000/api/v1/visit-requests/65a1b2c3d4e5f6g7h8i9j0k3 \
  -H "Authorization: Bearer OWNER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted"
  }'
```

**Status options:** `accepted`, `rejected`, `completed`, `cancelled`

---

## Rental Applications

### 1. Submit Rental Application

```bash
curl -X POST http://localhost:5000/api/v1/properties/65a1b2c3d4e5f6g7h8i9j0k2/applications \
  -H "Authorization: Bearer TENANT_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, I am very interested in renting this property. I am a working professional with a stable income and good references. I am looking for a long-term rental and can provide all necessary documentation.",
    "monthlyRentOffered": 35000,
    "moveInDate": "2024-02-01"
  }'
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
    "property": "65a1b2c3d4e5f6g7h8i9j0k2",
    "tenant": "65a1b2c3d4e5f6g7h8i9j0k1",
    "owner": "65a1b2c3d4e5f6g7h8i9j0k0",
    "message": "Hello, I am very interested...",
    "monthlyRentOffered": 35000,
    "moveInDate": "2024-02-01T00:00:00.000Z",
    "status": "pending",
    "createdAt": "2024-01-15T13:00:00.000Z"
  },
  "message": "Application submitted successfully"
}
```

### 2. Get Tenant's Applications

```bash
curl -X GET http://localhost:5000/api/v1/applications/me \
  -H "Authorization: Bearer TENANT_JWT_TOKEN"
```

### 3. Get Owner's Applications

```bash
curl -X GET http://localhost:5000/api/v1/owner/applications \
  -H "Authorization: Bearer OWNER_JWT_TOKEN"
```

### 4. Update Application Status (Owner Only)

```bash
curl -X PATCH http://localhost:5000/api/v1/applications/65a1b2c3d4e5f6g7h8i9j0k4 \
  -H "Authorization: Bearer OWNER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted"
  }'
```

**Status options:** `shortlisted`, `rejected`, `accepted`, `cancelled`

---

## Favorites

### 1. Add to Favorites

```bash
curl -X POST http://localhost:5000/api/v1/properties/65a1b2c3d4e5f6g7h8i9j0k2/favorite \
  -H "Authorization: Bearer USER_JWT_TOKEN"
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
    "tenant": "65a1b2c3d4e5f6g7h8i9j0k1",
    "property": "65a1b2c3d4e5f6g7h8i9j0k2",
    "createdAt": "2024-01-15T14:00:00.000Z"
  },
  "message": "Property added to favorites"
}
```

### 2. Remove from Favorites

```bash
curl -X DELETE http://localhost:5000/api/v1/properties/65a1b2c3d4e5f6g7h8i9j0k2/favorite \
  -H "Authorization: Bearer USER_JWT_TOKEN"
```

### 3. Get Favorites

```bash
curl -X GET http://localhost:5000/api/v1/favorites \
  -H "Authorization: Bearer USER_JWT_TOKEN"
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "property": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "title": "Beautiful 2BHK Apartment",
        "rent": 35000,
        "bhk": 2,
        "location": {
          "city": "Mumbai",
          "area": "Bandra West"
        },
        "owner": {
          "name": "Jane Smith",
          "email": "jane@example.com"
        }
      },
      "createdAt": "2024-01-15T14:00:00.000Z"
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

**Validation Error (400)**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**Unauthorized (401)**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Forbidden (403)**
```json
{
  "success": false,
  "message": "Owner role required"
}
```

**Not Found (404)**
```json
{
  "success": false,
  "message": "Property not found"
}
```

**Conflict (409)**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Internal Server Error (500)**
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

Auth endpoints (register, login) are rate-limited:
- Window: 15 minutes
- Max requests: 100

If exceeded:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```
