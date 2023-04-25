import { usersService } from './usersService';
import CreateUserDto from '../dto/userDTO';
import usersModel from '../Model/usersModel'

describe('usersService', () => {

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    avatarImage: 'https://example.com/picture.jpg'
  };

  describe('test', () => {
    it('see if its working', async () => {
      const sum = 1+ 1

      expect(sum).toEqual(2)
    })
  })
 
  describe('create', () => {
    it('should create a new user', async () => {

      usersModel.create = jest.fn().mockReturnValueOnce(mockUser)

      const createUserDto: CreateUserDto = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        avatarImage: mockUser.avatarImage
      };

      const createdUser = await usersService.create(createUserDto);

      expect(createdUser).toEqual(mockUser);
      expect(usersModel.create).toHaveBeenCalledWith(createUserDto);

    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {

      const userId = 'userID'
      
      usersModel.findById = jest.fn().mockReturnValueOnce(mockUser)

      const result = await usersService.findById(userId);

      expect(usersModel.findById).toHaveBeenCalledTimes(1);
      expect(usersModel.findById).toHaveBeenCalledWith('userID');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {

      usersModel.findOne = jest.fn().mockReturnValueOnce(mockUser)

      const result = await usersService.findByEmail('johndoe@example.com');

      expect(usersModel.findOne).toHaveBeenCalledTimes(1);
      expect(usersModel.findOne).toHaveBeenCalledWith({ email: 'johndoe@example.com' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteOne', () => {
    it('should delete a user by ID', async () => {
      usersModel.deleteOne = jest.fn().mockReturnValueOnce({"acknowledged": true,"deletedCount": 1})
      let userID = '1'

      const result = await usersService.deleteOne(userID);

      expect(usersModel.deleteOne).toHaveBeenCalledTimes(1);
      expect(usersModel.deleteOne).toHaveBeenCalledWith({ _id: userID });
      expect(result).toEqual({"acknowledged": true,"deletedCount": 1});
    });
  });

  describe('deleteOne', () => {
    it('should not delete a user that is already deleted', async () => {
      usersModel.deleteOne = jest.fn().mockReturnValueOnce({"acknowledged": true,"deletedCount": 0})
      let userID = '1'

      const result = await usersService.deleteOne(userID);

      expect(usersModel.deleteOne).toHaveBeenCalledTimes(1);
      expect(usersModel.deleteOne).toHaveBeenCalledWith({ _id: userID });
      expect(result).toEqual({"acknowledged": true,"deletedCount": 0});
    });
  });
});