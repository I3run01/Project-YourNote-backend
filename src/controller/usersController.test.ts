import request from 'supertest';
import app from '../app';

describe('UsersController', () => {
  describe('ping', () => {
    it('should return a response with "pong: true"', async () => {
      const response = await request(app).get('/api/users/ping');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ pong: true });
    });
  });
});
