import request from 'supertest';
import app from '../app'; // import your express app
import { usersService } from '../services/usersService';
import bcrypt from 'bcryptjs'

const usersMock = {
    id: 1,
    email: 'test@gmail.com',
    status: 'Active'
}

jest.mock('../services/usersService', () => {
    return {
      usersService: jest.fn().mockImplementation(() => {
        return {
          findByEmail: jest.fn().mockReturnValue(usersMock),
          create: jest.fn().mockImplementation((userDto) => Promise.resolve({
            ...userDto,
            _id: 'mockedUserId',
          })),
          // Mock other methods here
        };
      }),
    };
  });

describe('POST /api/users/signup', () => {

  it('should sign up with valid credentials', async () => {
    new usersService().findByEmail = jest.fn().mockReturnValue(null)

    const response = await request(app)
        .post('/api/users/signup')
        .send({ email: 'newuser@gmail.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('email', 'newuser@gmail.com');
  });

  it('should not sign up with existing user email', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@gmail.com', password: 'password' });

    expect(response.status).toBe(400);
  });

  it('should not sign up with invalid or incomplete credentials', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({ email: ''});

    expect(response.status).toBe(400);
  });
});