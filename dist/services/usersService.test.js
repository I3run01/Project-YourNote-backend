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
const usersService_1 = require("./usersService");
const usersModel_1 = __importDefault(require("../Model/usersModel"));
describe('usersService', () => {
    const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        avatarImage: 'https://example.com/picture.jpg'
    };
    describe('test', () => {
        it('see if its working', () => __awaiter(void 0, void 0, void 0, function* () {
            const sum = 1 + 1;
            expect(sum).toEqual(2);
        }));
    });
    describe('create', () => {
        it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            usersModel_1.default.create = jest.fn().mockReturnValueOnce(mockUser);
            const createUserDto = {
                name: mockUser.name,
                email: mockUser.email,
                password: mockUser.password,
                avatarImage: mockUser.avatarImage
            };
            const createdUser = yield usersService_1.usersService.create(createUserDto);
            expect(createdUser).toEqual(mockUser);
            expect(usersModel_1.default.create).toHaveBeenCalledWith(createUserDto);
        }));
    });
    describe('findById', () => {
        it('should find a user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = 'userID';
            usersModel_1.default.findById = jest.fn().mockReturnValueOnce(mockUser);
            const result = yield usersService_1.usersService.findById(userId);
            expect(usersModel_1.default.findById).toHaveBeenCalledTimes(1);
            expect(usersModel_1.default.findById).toHaveBeenCalledWith('userID');
            expect(result).toEqual(mockUser);
        }));
    });
    describe('findByEmail', () => {
        it('should find a user by email', () => __awaiter(void 0, void 0, void 0, function* () {
            usersModel_1.default.findOne = jest.fn().mockReturnValueOnce(mockUser);
            const result = yield usersService_1.usersService.findByEmail('johndoe@example.com');
            expect(usersModel_1.default.findOne).toHaveBeenCalledTimes(1);
            expect(usersModel_1.default.findOne).toHaveBeenCalledWith({ email: 'johndoe@example.com' });
            expect(result).toEqual(mockUser);
        }));
    });
    describe('deleteOne', () => {
        it('should delete a user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            usersModel_1.default.deleteOne = jest.fn().mockReturnValueOnce({ "acknowledged": true, "deletedCount": 1 });
            let userID = '1';
            const result = yield usersService_1.usersService.deleteOne(userID);
            expect(usersModel_1.default.deleteOne).toHaveBeenCalledTimes(1);
            expect(usersModel_1.default.deleteOne).toHaveBeenCalledWith({ _id: userID });
            expect(result).toEqual({ "acknowledged": true, "deletedCount": 1 });
        }));
    });
    describe('deleteOne', () => {
        it('should not delete a user that is already deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            usersModel_1.default.deleteOne = jest.fn().mockReturnValueOnce({ "acknowledged": true, "deletedCount": 0 });
            let userID = '1';
            const result = yield usersService_1.usersService.deleteOne(userID);
            expect(usersModel_1.default.deleteOne).toHaveBeenCalledTimes(1);
            expect(usersModel_1.default.deleteOne).toHaveBeenCalledWith({ _id: userID });
            expect(result).toEqual({ "acknowledged": true, "deletedCount": 0 });
        }));
    });
});
