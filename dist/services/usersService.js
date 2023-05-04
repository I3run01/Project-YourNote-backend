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
exports.usersService = void 0;
const usersModel_1 = __importDefault(require("../Model/usersModel"));
class usersService {
    create(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return usersModel_1.default.create(createUserDto);
        });
    }
    findbyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersModel_1.default.findById(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersModel_1.default.findOne({ email });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersModel_1.default.deleteOne({ _id: id });
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersModel_1.default.updateOne({ _id: id }, { status });
        });
    }
    updatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersModel_1.default.updateOne({ _id: id }, { password });
        });
    }
}
exports.usersService = usersService;
