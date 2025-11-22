import request from 'supertest';
import app from '../app';
import { User, UserRole } from '../models/User';

describe('Authentication Flow', () => {
    describe('POST /api/v1/auth/register', () => {
        it('should register a new tenant user', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '9876543210',
                password: 'password123',
            };

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.user.role).toBe(UserRole.TENANT);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.password).toBeUndefined();
        });

        it('should register a new owner user', async () => {
            const userData = {
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '9876543211',
                password: 'password123',
                role: UserRole.OWNER,
            };

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.data.user.role).toBe(UserRole.OWNER);
        });

        it('should not register with duplicate email', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '9876543210',
                password: 'password123',
            };

            await request(app).post('/api/v1/auth/register').send(userData);

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already');
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({ email: 'test@example.com' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            await User.create({
                name: 'Test User',
                email: 'test@example.com',
                phone: '9876543210',
                password: 'password123',
                role: UserRole.TENANT,
            });
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('test@example.com');
            expect(response.body.data.token).toBeDefined();
        });

        it('should not login with invalid email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'password123',
                })
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        it('should not login with invalid password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                })
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/auth/me', () => {
        let token: string;

        beforeEach(async () => {
            const response = await request(app).post('/api/v1/auth/register').send({
                name: 'Test User',
                email: 'test@example.com',
                phone: '9876543210',
                password: 'password123',
            });

            token = response.body.data.token;
        });

        it('should get current user profile', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe('test@example.com');
        });

        it('should not get profile without token', async () => {
            const response = await request(app).get('/api/v1/auth/me').expect(401);

            expect(response.body.success).toBe(false);
        });

        it('should not get profile with invalid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer invalidtoken')
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/users/me', () => {
        let token: string;

        beforeEach(async () => {
            const response = await request(app).post('/api/v1/auth/register').send({
                name: 'Test User',
                email: 'test@example.com',
                phone: '9876543210',
                password: 'password123',
            });

            token = response.body.data.token;
        });

        it('should update user profile', async () => {
            const response = await request(app)
                .patch('/api/v1/users/me')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Name',
                    phone: '9999999999',
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe('Updated Name');
            expect(response.body.data.phone).toBe('9999999999');
        });
    });

    describe('PATCH /api/v1/users/me/role', () => {
        let token: string;

        beforeEach(async () => {
            const response = await request(app).post('/api/v1/auth/register').send({
                name: 'Test User',
                email: 'test@example.com',
                phone: '9876543210',
                password: 'password123',
            });

            token = response.body.data.token;
        });

        it('should convert tenant to owner', async () => {
            const response = await request(app)
                .patch('/api/v1/users/me/role')
                .set('Authorization', `Bearer ${token}`)
                .send({ confirmRole: 'owner' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.role).toBe(UserRole.OWNER);
        });
    });
});
