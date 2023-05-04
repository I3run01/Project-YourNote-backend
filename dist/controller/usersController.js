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
exports.UsersController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usersService_1 = require("../services/usersService");
const jwtToken_1 = require("../auth/jwtToken");
const jwtToken_2 = require("../auth/jwtToken");
const functions_1 = require("../utils/functions");
const functions_2 = require("../utils/functions");
class UsersController {
    ping(req, res) {
        res.json({ pong: true });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({
                    message: 'invalide credentials'
                });
            let user = yield new usersService_1.usersService().findByEmail(email);
            if ((user === null || user === void 0 ? void 0 : user.status) !== "Active" && user) {
                const confirmationCode = jwtToken_2.newToken.jwtEncoded(user.id);
                const emailConfirmationLink = `http://localhost:3000/emailConfirmation/${confirmationCode}`;
                console.log(confirmationCode);
                functions_1.utilsFn.sendConfirmationEmail(user.name, user.email, emailConfirmationLink);
                return res.status(401).json({
                    message: "Pending Account. Please Verify Your Email!, a new link was sent in your email",
                });
            }
            if (user)
                return res.status(400).json({
                    message: 'user already exists'
                });
            const UserDto = {
                name: null,
                email,
                password: yield bcryptjs_1.default.hash(password, 10),
                avatarImage: null,
            };
            try {
                let newUser = yield new usersService_1.usersService().create(UserDto);
                const confirmationCode = jwtToken_2.newToken.jwtEncoded(newUser.id);
                const emailConfirmationLink = `http://localhost:3000/emailConfirmation/${confirmationCode}`;
                functions_1.utilsFn.sendConfirmationEmail(UserDto.name, UserDto.email, emailConfirmationLink);
                return res.json(newUser);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield new usersService_1.usersService().findByEmail(email);
            try {
                if (!user || !(user === null || user === void 0 ? void 0 : user.password) === null)
                    return res.status(400).json({
                        message: 'no user found',
                    });
                else if (!(yield bcryptjs_1.default.compare(password, user.password)))
                    return res.status(401).send({
                        message: 'invalid credentials',
                    });
                else if (user.status !== "Active") {
                    const confirmationCode = jwtToken_2.newToken.jwtEncoded(user.id);
                    console.log(confirmationCode);
                    const emailConfirmationLink = `http://localhost:3000/emailConfirmation/${confirmationCode}`;
                    functions_1.utilsFn.sendConfirmationEmail(user.name, user.email, emailConfirmationLink);
                    return res.status(410).send({
                        message: "Pending Account. Please Verify Your Email!, a new link was sent in your email",
                    });
                }
                let token = jwtToken_1.jwtToken.jwtEncoded(user.id);
                res.cookie('jwt', token, { httpOnly: true });
                user.password = null;
                return res.json(user);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield req.cookies['jwt'];
                let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
                if (!data)
                    return res.status(401).json({
                        message: 'Unauthorized request',
                    });
                let user = yield new usersService_1.usersService().findbyId(data.id);
                if (!user) {
                    return res.status(400).json({
                        message: "No user found",
                    });
                }
                if (user.status !== "Active") {
                    const confirmationCode = jwtToken_2.newToken.jwtEncoded(user.id);
                    functions_1.utilsFn.sendConfirmationEmail(user.name, user.email, confirmationCode);
                    return res.status(401).json({
                        message: "Pending Account. Please Verify Your Email!. We sent a new link to your email",
                    });
                }
                return res.json(user);
            }
            catch (_a) {
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            }
        });
    }
    emailConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            try {
                let data = JSON.parse(jwtToken_2.newToken.jwtDecoded(token));
                if (!data)
                    return res.status(400).json({
                        message: 'invalid token',
                    });
                let user = yield new usersService_1.usersService().findbyId(data.id);
                if (!user)
                    return res.status(400).json({
                        message: 'no user found',
                    });
                yield new usersService_1.usersService().updateStatus(user.id, 'Active');
                let userToken = jwtToken_1.jwtToken.jwtEncoded(user.id);
                res.cookie('jwt', userToken, { httpOnly: true });
                return res.json(user);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    signOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie('jwt');
            return res.json({ message: 'success' });
        });
    }
    deleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield req.cookies['jwt'];
            if (!token)
                return res.status(400).json({
                    message: 'no token has been sent',
                });
            const data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
            try {
                return res.json(yield new usersService_1.usersService().deleteUser(data.id));
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    googleSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { googleToken } = req.body;
            if (!googleToken)
                return res.status(400).json({ message: 'no token sent' });
            try {
                let googleUser = JSON.parse(yield functions_2.requests.googleLogin(googleToken));
                let user = yield new usersService_1.usersService().findByEmail(googleUser.email);
                if (!user) {
                    user = yield new usersService_1.usersService().create({
                        name: googleUser.name,
                        email: googleUser.email,
                        password: yield bcryptjs_1.default.hash(String(Math.random()), 10),
                        avatarImage: googleUser.picture,
                    });
                }
                let userToken = jwtToken_1.jwtToken.jwtEncoded(user.id);
                user.password = null;
                res.cookie('jwt', userToken, { httpOnly: true });
                return res.json(user);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    sendPasswordResetLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email)
                return res.status(400).send({
                    message: 'no email received'
                });
            try {
                const user = yield new usersService_1.usersService().findByEmail(email);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const resetPasswordToken = jwtToken_2.newToken.jwtEncoded(user.id);
                const resetLink = `http://example.com/reset-password?token=${resetPasswordToken}`;
                functions_1.utilsFn.sendConfirmationEmail(user.name, user.email, resetLink);
                return res.status(200).json({ message: 'Password reset link sent to your email' });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json(error);
            }
        });
    }
    ;
    updatePasswordWithToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = req.body;
            try {
                let hashPassword = yield bcryptjs_1.default.hash(String(password), 10);
                const token = yield req.cookies['jwt'];
                let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
                if (!data)
                    return res.status(401).json({
                        message: 'Unauthorized request',
                    });
                let user = yield new usersService_1.usersService().findbyId(data.id);
                if (!user) {
                    return res.status(400).json({ message: 'no user found' });
                }
                yield new usersService_1.usersService().updatePassword(user.id, hashPassword);
                return res.status(200).json({ message: 'Password updated successfully' });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json(error);
            }
        });
    }
    ;
}
exports.UsersController = UsersController;
