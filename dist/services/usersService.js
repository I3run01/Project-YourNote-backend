"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const usersModel_1 = __importDefault(require("../models/usersModel"));
class usersService {
    create(createUserDto) {
        return usersModel_1.default.create(createUserDto);
    }
    findbyId(id) {
        return usersModel_1.default.findById(id);
    }
    findByEmail(email) {
        return usersModel_1.default.findOne({ email });
    }
    deleteUser(id) {
        return usersModel_1.default.deleteOne({ _id: id });
    }
    async updateStatus(id, status) {
        const user = await usersModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }
    async updatePassword(id, password) {
        const user = await usersModel_1.default.findByIdAndUpdate(id, { password }, { new: true });
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }
}
exports.usersService = usersService;
