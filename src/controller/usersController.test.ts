import request from 'supertest';
import app from '../app';
import bcrypt from 'bcryptjs'
import { usersService } from '../services/usersService';
import { jwtToken } from '../auth/jwtToken'

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
    it('should return a response with "pong: true"', async () => {
      const response = await request(app).get('/api/users/ping');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ pong: true });
    });
  });

  describe('signUp', () => {
    it('should create a new user and return it with status code 200', async () => {
      usersService.findByEmail = jest.fn().mockReturnValue(null)
      usersService.create = jest.fn().mockReturnValueOnce(userMock)

      const response = await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@example.com', password: '1234' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.password).toBe(null)
    });

    it('should return an error if the user already exists', async () => {
      usersService.findByEmail = jest.fn().mockReturnValue(userMock)
      usersService.create = jest.fn().mockReturnValue(userMock)

      const response = await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@example.com', password: 'password' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'user already exists');
    });
  });
  
  describe('signIn', () => {
    it('should return a JWT token and the user with status code 200', async () => {

      usersService.findByEmail = jest.fn().mockReturnValue(userMock)
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      
      const response = await request(app)
        .post('/api/users/signin')
        .send({ email: 'test@example.com', password: '1234' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.password).toBe(null);
      expect(response.headers).toHaveProperty('set-cookie');
    });

    it('should return an error if the credentials are invalid', async () => {
      usersService.findByEmail = jest.fn().mockReturnValue(userMock)

      bcrypt.compare = jest.fn().mockReturnValueOnce(false)

      const response = await request(app)
        .post('/api/users/signin')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'invalid credentials');
    });
  });

  describe('signOut', () => {
    let route = '/api/users/signout'

    it('should clear the JWT cookie and return success with status code 200', async () => {
      const response = await request(app).get(route);
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('set-cookie');
      expect(response.headers['set-cookie'][0]).toMatch(/^jwt=;/);
    });
  });

  describe('users', () => {
    it('should return user data when JWT is valid', async () => {
      let userID = '4'
      const token = jwtToken.jwtEncoded(userID);

      usersService.findById = jest.fn().mockResolvedValue(userMock);
  
      const response = await request(app)
        .get('/api/users')
        .set('Cookie', [`jwt=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(userMock);
    });
  
    it('should return a "Unauthorized request" error when no JWT is present', async () => {

      const response = await request(app).get('/api/users');
  
      // Expect the response to have a status code of 401 and the error message
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Unauthorized request',
        error: 'bad request'
      });
    });
  
    it('should return a "no user has been found" error when the JWT is invalid', async () => {
      let userID = 'notRegistredUser'
      const token = jwtToken.jwtEncoded(userID);
  
      usersService.findById = jest.fn().mockResolvedValue(null);
  
      const response = await request(app)
        .get('/api/users')
        .set('Cookie', [`jwt=${token}`]);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'no user has been found',
        error: 'bad request'
      });
    });
  });
});
