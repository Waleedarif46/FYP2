const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Authentication Endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Test User',
                    email: 'test@example.com',
                    password: 'Test123!@#',
                    role: 'deaf'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.email).toBe('test@example.com');
            expect(res.body.role).toBe('deaf');
        });

        it('should not register user with existing email', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Test User',
                    email: 'test@example.com',
                    password: 'Test123!@#',
                    role: 'deaf'
                });

            // Second registration with same email
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Test User 2',
                    email: 'test@example.com',
                    password: 'Test123!@#',
                    role: 'learner'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Test User',
                    email: 'test@example.com',
                    password: 'Test123!@#',
                    role: 'deaf'
                });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test123!@#'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.email).toBe('test@example.com');
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should not login with invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });
    });

    describe('GET /api/auth/me', () => {
        let token;

        beforeEach(async () => {
            // Register and login to get token
            await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Test User',
                    email: 'test@example.com',
                    password: 'Test123!@#',
                    role: 'deaf'
                });

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test123!@#'
                });

            token = loginRes.headers['set-cookie'][0];
        });

        it('should get current user with valid token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Cookie', token);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.email).toBe('test@example.com');
        });

        it('should not get current user without token', async () => {
            const res = await request(app)
                .get('/api/auth/me');

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Not authorized, no token');
        });
    });

    describe('POST /api/auth/logout', () => {
        let token;

        beforeEach(async () => {
            // Register and login to get token
            await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Test User',
                    email: 'test@example.com',
                    password: 'Test123!@#',
                    role: 'deaf'
                });

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test123!@#'
                });

            token = loginRes.headers['set-cookie'][0];
        });

        it('should logout successfully', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Cookie', token);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Logged out successfully');
            expect(res.headers['set-cookie'][0]).toContain('token=;');
        });
    });
}); 