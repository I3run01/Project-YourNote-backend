import { usersService } from './usersService';
import { mongoConnect, mongoDisconnect } from '../database/mongoDB';

beforeAll(async () => {
  await mongoConnect(); // connect to the database before running the tests
});

afterAll(async () => {
  await mongoDisconnect(); // disconnect from the database after running the tests
});

describe('usersService', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        avatarImage: null
      };
      const createdUser = await usersService.create(newUser);
      expect(createdUser).toMatchObject(newUser);
    });
  });



});