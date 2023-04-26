import request from 'supertest';
import app from '../app';
import { usersService } from '../services/usersService';

const userMock = {
  id: 'id',
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
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
        .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('john.doe@example.com');
      expect(response.body.password).toBe(null)
    });

    it('should return an error if the user already exists', async () => {
      usersService.findByEmail = jest.fn().mockReturnValueOnce(userMock)
      usersService.create = jest.fn().mockReturnValueOnce(userMock)

      const response = await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@example.com', password: 'password' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'user already exists');
    });
  });

  /*

  describe('signIn', () => {
    it('should return a JWT token and the user with status code 200', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({ email: 'test@example.com', password: 'password' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body).not.toHaveProperty('password');
      expect(response.headers).toHaveProperty('set-cookie');
    });

    it('should return an error if the credentials are invalid', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({ email: 'test@example.com', password: 'wrongpassword' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should clear the JWT cookie and return success with status code 200', async () => {
      const response = await request(app).get('/api/sign-out');
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('set-cookie');
      expect(response.headers['set-cookie'][0]).toMatch(/^jwt=;/);
    });
  });

  describe('user', () => {
    it('should return the authenticated user with status code 200', async () => {
      const agent = request.agent(app); // Create a session to send authenticated requests
      await agent.post('/api/sign-in').send({ email: 'test@example.com', password: 'password' });
      const response = await agent.get('/api/user');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return an error if the user is not authenticated', async () => {
      const response = await request(app).get('/api/user');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Unauthorized request');
    });
  });

  
  describe('deleteOne', () => {
    it('should delete a user and return a success message', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: await hash('password', 10),
        avatarImage: 'https://example.com/avatar.png',
      });
      const token = jwtToken.jwtEncoded(user.id);
      const req = mockRequest(null, { cookies: { jwt: token } });
      const res = mockResponse();
      await UsersController.deleteOne(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'success' });
      const deletedUser = await User.findById(user.id);
      expect(deletedUser).toBeNull();
    });
  
    it('should return an error message if user not found', async () => {
      const token = jwtToken.jwtEncoded('non-existing-user-id');
      const req = mockRequest(null, { cookies: { jwt: token } });
      const res = mockResponse();
      await UsersController.deleteOne(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found',
        error: 'not found',
      });
    });
  
    it('should return an error message if JWT is invalid', async () => {
      const req = mockRequest(null, { cookies: { jwt: 'invalid-token' } });
      const res = mockResponse();
      await UsersController.deleteOne(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized request',
        error: 'bad request',
      });
    });
  });
  */

});
