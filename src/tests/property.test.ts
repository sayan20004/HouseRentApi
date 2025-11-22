import request from 'supertest';
import app from '../app';
import { User, UserRole } from '../models/User';
import { Property, PropertyType, Furnishing, AllowedTenants } from '../models/Property';

describe('Property Management', () => {
    let ownerToken: string;
    let tenantToken: string;
    let ownerId: string;

    beforeEach(async () => {
        // Create owner user
        const ownerResponse = await request(app).post('/api/v1/auth/register').send({
            name: 'Property Owner',
            email: 'owner@example.com',
            phone: '9876543210',
            password: 'password123',
            role: UserRole.OWNER,
        });
        ownerToken = ownerResponse.body.data.token;
        ownerId = ownerResponse.body.data.user._id;

        // Create tenant user
        const tenantResponse = await request(app).post('/api/v1/auth/register').send({
            name: 'Tenant User',
            email: 'tenant@example.com',
            phone: '9876543211',
            password: 'password123',
        });
        tenantToken = tenantResponse.body.data.token;
    });

    describe('POST /api/v1/properties', () => {
        const validPropertyData = {
            title: 'Beautiful 2BHK Apartment in Downtown',
            description:
                'A spacious 2BHK apartment with modern amenities, perfect for families. Located in the heart of downtown with easy access to public transport.',
            propertyType: PropertyType.APARTMENT,
            bhk: 2,
            furnishing: Furnishing.FULLY_FURNISHED,
            rent: 25000,
            securityDeposit: 50000,
            maintenance: {
                amount: 2000,
                included: false,
            },
            builtUpArea: 1200,
            availableFrom: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            minLockInPeriodMonths: 11,
            allowedTenants: AllowedTenants.FAMILY,
            petsAllowed: true,
            smokingAllowed: false,
            location: {
                city: 'Mumbai',
                area: 'Bandra West',
                landmark: 'Near Linking Road',
                pincode: '400050',
                geo: {
                    lat: 19.0596,
                    lng: 72.8295,
                },
            },
            amenities: ['Parking', 'Lift', 'Security', 'Power Backup', 'Gym'],
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        };

        it('should create property as owner', async () => {
            const response = await request(app)
                .post('/api/v1/properties')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send(validPropertyData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe(validPropertyData.title);
            expect(response.body.data.owner._id).toBe(ownerId);
        });

        it('should not create property as tenant', async () => {
            const response = await request(app)
                .post('/api/v1/properties')
                .set('Authorization', `Bearer ${tenantToken}`)
                .send(validPropertyData)
                .expect(403);

            expect(response.body.success).toBe(false);
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/v1/properties')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({ title: 'Test' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('GET /api/v1/properties', () => {
        beforeEach(async () => {
            // Create multiple properties
            await Property.create([
                {
                    owner: ownerId,
                    title: 'Affordable 1BHK in Suburb',
                    description: 'A nice 1BHK apartment suitable for bachelors and students in peaceful suburb area.',
                    propertyType: PropertyType.APARTMENT,
                    bhk: 1,
                    furnishing: Furnishing.SEMI_FURNISHED,
                    rent: 15000,
                    securityDeposit: 30000,
                    builtUpArea: 600,
                    availableFrom: new Date(),
                    location: {
                        city: 'Mumbai',
                        area: 'Andheri East',
                        pincode: '400069',
                    },
                    status: 'active',
                },
                {
                    owner: ownerId,
                    title: 'Luxury 3BHK Penthouse',
                    description: 'Premium penthouse with stunning views and world-class amenities for discerning families.',
                    propertyType: PropertyType.APARTMENT,
                    bhk: 3,
                    furnishing: Furnishing.FULLY_FURNISHED,
                    rent: 75000,
                    securityDeposit: 150000,
                    builtUpArea: 2000,
                    availableFrom: new Date(),
                    location: {
                        city: 'Mumbai',
                        area: 'Bandra West',
                        pincode: '400050',
                    },
                    status: 'active',
                },
            ]);
        });

        it('should get all active properties', async () => {
            const response = await request(app).get('/api/v1/properties').expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.pagination).toBeDefined();
        });

        it('should filter properties by city', async () => {
            const response = await request(app).get('/api/v1/properties?city=Mumbai').expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should filter properties by rent range', async () => {
            const response = await request(app)
                .get('/api/v1/properties?minRent=10000&maxRent=20000')
                .expect(200);

            expect(response.body.success).toBe(true);
            response.body.data.forEach((property: any) => {
                expect(property.rent).toBeGreaterThanOrEqual(10000);
                expect(property.rent).toBeLessThanOrEqual(20000);
            });
        });

        it('should filter properties by BHK', async () => {
            const response = await request(app).get('/api/v1/properties?bhk=1').expect(200);

            expect(response.body.success).toBe(true);
            response.body.data.forEach((property: any) => {
                expect(property.bhk).toBe(1);
            });
        });

        it('should support pagination', async () => {
            const response = await request(app).get('/api/v1/properties?page=1&limit=1').expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.limit).toBe(1);
        });

        it('should sort by rent (low to high)', async () => {
            const response = await request(app)
                .get('/api/v1/properties?sortBy=rent_low_to_high')
                .expect(200);

            expect(response.body.success).toBe(true);
            const rents = response.body.data.map((p: any) => p.rent);
            const sortedRents = [...rents].sort((a, b) => a - b);
            expect(rents).toEqual(sortedRents);
        });
    });

    describe('GET /api/v1/properties/:id', () => {
        let propertyId: string;

        beforeEach(async () => {
            const property = await Property.create({
                owner: ownerId,
                title: 'Test Property',
                description: 'A test property description that meets the minimum character requirement for validation.',
                propertyType: PropertyType.APARTMENT,
                bhk: 2,
                furnishing: Furnishing.FULLY_FURNISHED,
                rent: 25000,
                securityDeposit: 50000,
                builtUpArea: 1000,
                availableFrom: new Date(),
                location: {
                    city: 'Mumbai',
                    area: 'Bandra',
                    pincode: '400050',
                },
            });
            propertyId = property._id.toString();
        });

        it('should get property by ID', async () => {
            const response = await request(app).get(`/api/v1/properties/${propertyId}`).expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data._id).toBe(propertyId);
        });

        it('should return 404 for non-existent property', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await request(app).get(`/api/v1/properties/${fakeId}`).expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/properties/:id', () => {
        let propertyId: string;

        beforeEach(async () => {
            const property = await Property.create({
                owner: ownerId,
                title: 'Original Title',
                description: 'Original description that meets the minimum character requirement for the property validation.',
                propertyType: PropertyType.APARTMENT,
                bhk: 2,
                furnishing: Furnishing.FULLY_FURNISHED,
                rent: 25000,
                securityDeposit: 50000,
                builtUpArea: 1000,
                availableFrom: new Date(),
                location: {
                    city: 'Mumbai',
                    area: 'Bandra',
                    pincode: '400050',
                },
            });
            propertyId = property._id.toString();
        });

        it('should update property as owner', async () => {
            const response = await request(app)
                .patch(`/api/v1/properties/${propertyId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({ rent: 30000 })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.rent).toBe(30000);
        });

        it('should not update property as non-owner', async () => {
            const response = await request(app)
                .patch(`/api/v1/properties/${propertyId}`)
                .set('Authorization', `Bearer ${tenantToken}`)
                .send({ rent: 30000 })
                .expect(403);

            expect(response.body.success).toBe(false);
        });
    });

    describe('DELETE /api/v1/properties/:id', () => {
        let propertyId: string;

        beforeEach(async () => {
            const property = await Property.create({
                owner: ownerId,
                title: 'To Be Deleted',
                description: 'A property that will be deleted in the test to verify the soft delete functionality works.',
                propertyType: PropertyType.APARTMENT,
                bhk: 2,
                furnishing: Furnishing.FULLY_FURNISHED,
                rent: 25000,
                securityDeposit: 50000,
                builtUpArea: 1000,
                availableFrom: new Date(),
                location: {
                    city: 'Mumbai',
                    area: 'Bandra',
                    pincode: '400050',
                },
            });
            propertyId = property._id.toString();
        });

        it('should delete property as owner', async () => {
            const response = await request(app)
                .delete(`/api/v1/properties/${propertyId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);

            // Verify it's soft deleted (status changed to paused)
            const property = await Property.findById(propertyId);
            expect(property?.status).toBe('paused');
        });

        it('should not delete property as non-owner', async () => {
            const response = await request(app)
                .delete(`/api/v1/properties/${propertyId}`)
                .set('Authorization', `Bearer ${tenantToken}`)
                .expect(403);

            expect(response.body.success).toBe(false);
        });
    });
});
