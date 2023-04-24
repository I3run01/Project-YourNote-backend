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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const bcrypt_1 = require("bcrypt");
const usersService_1 = require("../services/usersService");
exports.UsersController = {
    ping: () => {
        return { pong: 'dfafhg' };
    },
    signUp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        let user = yield usersService_1.usersService.findByEmail(email);
        if (user) {
            res.status(400);
            res.json({ message: 'user already exists' });
        }
        const createUserDto = {
            name: null,
            email,
            password: yield (0, bcrypt_1.hash)(password, 10),
            avatarImage: null,
        };
        user = yield usersService_1.usersService.create(createUserDto);
        user.password = null;
        res.json(user);
    }),
};
