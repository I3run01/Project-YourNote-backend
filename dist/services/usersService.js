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
const users_1 = __importDefault(require("../Model/users"));
exports.usersService = {
    create: (createUserDto) => __awaiter(void 0, void 0, void 0, function* () {
        return users_1.default.create(createUserDto);
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield users_1.default.findById(id);
    }),
    findByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield users_1.default.findOne({ email });
    }),
    deleteOne: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield users_1.default.deleteOne({ _id: id });
    }),
};
