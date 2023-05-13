"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const usersModel_1 = __importDefault(require("../Model/usersModel"));
class usersService {
    async create(createUserDto) {
        return usersModel_1.default.create(createUserDto);
    }
    async findbyId(id) {
        return await usersModel_1.default.findById(id);
    }
    async findByEmail(email) {
        return await usersModel_1.default.findOne({ email });
    }
    async deleteUser(id) {
        return await usersModel_1.default.deleteOne({ _id: id });
    }
    async updateStatus(id, status) {
        return await usersModel_1.default.updateOne({ _id: id }, { status });
    }
    async updatePassword(id, password) {
        return await usersModel_1.default.updateOne({ _id: id }, { password });
    }
}
exports.usersService = usersService;
