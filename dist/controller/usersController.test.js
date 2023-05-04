"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usersService_1 = require("../services/usersService");
const jwtToken_1 = require("../auth/jwtToken");
jest.mock('bcrypt', () => ({
    bcryptCompare: jest.fn(),
}));
const userMock = {
    id: 'id',
    name: 'Name example',
    email: 'test@example.com',
    password: '$2b$10$6ovBea5IteMBfFK0l5iLlOxqFBMV06ut7OsFxIbES2FvWwZMGglsW',
    avatarImage: 'https://example.com/picture.jpg'
};
describe('UsersController', () => {
    describe('ping', () => {
        it('should return a response with "pong: true"', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/api/users/ping');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ pong: true });
        }));
    });
    describe('signUp', () => {
        it('should create a new user and return it with status code 200', () => __awaiter(void 0, void 0, void 0, function* () {
            usersService_1.usersService.findByEmail = jest.fn().mockReturnValue(null);
            usersService_1.usersService.create = jest.fn().mockReturnValueOnce(userMock);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/users/signup')
                .send({ email: 'test@example.com', password: '1234' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('test@example.com');
            expect(response.body.password).toBe(null);
        }));
        it('should return an error if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            usersService_1.usersService.findByEmail = jest.fn().mockReturnValue(userMock);
            usersService_1.usersService.create = jest.fn().mockReturnValue(userMock);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/users/signup')
                .send({ email: 'test@example.com', password: 'password' });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'user already exists');
        }));
    });
    describe('signIn', () => {
        it('should return a JWT token and the user with status code 200', () => __awaiter(void 0, void 0, void 0, function* () {
            usersService_1.usersService.findByEmail = jest.fn().mockReturnValue(userMock);
            jest.spyOn(bcryptjs_1.default, 'compare').mockImplementation(() => Promise.resolve(true));
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/users/signin')
                .send({ email: 'test@example.com', password: '1234' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('test@example.com');
            expect(response.body.password).toBe(null);
            expect(response.headers).toHaveProperty('set-cookie');
        }));
        it('should return an error if the credentials are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            usersService_1.usersService.findByEmail = jest.fn().mockReturnValue(userMock);
            bcryptjs_1.default.compare = jest.fn().mockReturnValueOnce(false);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/users/signin')
                .send({ email: 'test@example.com', password: 'wrongpassword' });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'invalid credentials');
        }));
    });
    describe('signOut', () => {
        let route = '/api/users/signout';
        it('should clear the JWT cookie and return success with status code 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get(route);
            expect(response.status).toBe(200);
            expect(response.headers).toHaveProperty('set-cookie');
            expect(response.headers['set-cookie'][0]).toMatch(/^jwt=;/);
        }));
    });
    describe('users', () => {
        it('should return user data when JWT is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            let userID = '4';
            const token = jwtToken_1.jwtToken.jwtEncoded(userID);
            usersService_1.usersService.findById = jest.fn().mockResolvedValue(userMock);
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/users')
                .set('Cookie', [`jwt=${token}`]);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(userMock);
        }));
        it('should return a "Unauthorized request" error when no JWT is present', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/api/users');
            // Expect the response to have a status code of 401 and the error message
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'Unauthorized request',
                error: 'bad request'
            });
        }));
        it('should return a "no user has been found" error when the JWT is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            let userID = 'notRegistredUser';
            const token = jwtToken_1.jwtToken.jwtEncoded(userID);
            usersService_1.usersService.findById = jest.fn().mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/users')
                .set('Cookie', [`jwt=${token}`]);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'no user has been found',
                error: 'bad request'
            });
        }));
    });
});
