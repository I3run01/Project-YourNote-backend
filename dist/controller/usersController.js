"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usersService_1 = require("../services/usersService");
const jwtToken_1 = require("../auth/jwtToken");
const functions_1 = require("../utils/functions");
const functions_2 = require("../utils/functions");
class UsersController {
    ping(req, res) {
        res.json({ pong: true });
    }
    async signUp(req, res) {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({
                message: 'invalide credentials'
            });
        let user = await new usersService_1.usersService().findByEmail(email);
        if (user?.status !== "Active" && user) {
            const confirmationCode = jwtToken_1.jwtToken.jwtEncoded(user.id);
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
            password: await bcryptjs_1.default.hash(password, 10),
            avatarImage: null,
        };
        try {
            let newUser = await new usersService_1.usersService().create(UserDto);
            const confirmationCode = jwtToken_1.jwtToken.jwtEncoded(newUser.id);
            const emailConfirmationLink = `http://localhost:3000/emailConfirmation/${confirmationCode}`;
            functions_1.utilsFn.sendConfirmationEmail(UserDto.name, UserDto.email, emailConfirmationLink);
            return res.json(newUser);
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
    async signIn(req, res) {
        const { email, password } = req.body;
        const user = await new usersService_1.usersService().findByEmail(email);
        try {
            if (!user || !user?.password === null)
                return res.status(400).json({
                    message: 'no user found',
                });
            else if (!await bcryptjs_1.default.compare(password, user.password))
                return res.status(401).send({
                    message: 'invalid credentials',
                });
            else if (user.status !== "Active") {
                const confirmationCode = jwtToken_1.jwtToken.jwtEncoded(user.id);
                console.log(confirmationCode);
                const emailConfirmationLink = `http://localhost:3000/emailConfirmation/${confirmationCode}`;
                functions_1.utilsFn.sendConfirmationEmail(user.name, user.email, emailConfirmationLink);
                return res.status(401).send({
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
    }
    async user(req, res) {
        try {
            const token = await req.cookies['jwt'];
            let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
            if (!data)
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            let user = await new usersService_1.usersService().findbyId(data.id);
            if (!user) {
                return res.status(400).json({
                    message: "No user found",
                });
            }
            if (user.status !== "Active") {
                const confirmationCode = jwtToken_1.jwtToken.jwtEncoded(user.id);
                functions_1.utilsFn.sendConfirmationEmail(user.name, user.email, confirmationCode);
                return res.status(401).json({
                    message: "Pending Account. Please Verify Your Email!. We sent a new link to your email",
                });
            }
            return res.json(user);
        }
        catch {
            return res.status(401).json({
                message: 'Unauthorized request',
            });
        }
    }
    async emailConfirmation(req, res) {
        const { token } = req.params;
        try {
            let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
            if (!data)
                return res.status(400).json({
                    message: 'invalid token',
                });
            let user = await new usersService_1.usersService().findbyId(data.id);
            if (!user)
                return res.status(400).json({
                    message: 'no user found',
                });
            await new usersService_1.usersService().updateStatus(user.id, 'Active');
            let userToken = jwtToken_1.jwtToken.jwtEncoded(user.id);
            res.cookie('jwt', userToken, { httpOnly: true });
            return res.json(user);
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
    async signOut(req, res) {
        res.clearCookie('jwt');
        return res.json({ message: 'success' });
    }
    async deleteOne(req, res) {
        const token = await req.cookies['jwt'];
        if (!token)
            return res.status(400).json({
                message: 'no token has been sent',
            });
        const data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
        try {
            return res.json(await new usersService_1.usersService().deleteUser(data.id));
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
    async googleSignIn(req, res) {
        const { googleToken } = req.body;
        if (!googleToken)
            return res.status(400).json({ message: 'no token sent' });
        try {
            let googleUser = JSON.parse(await functions_2.requests.googleLogin(googleToken));
            let user = await new usersService_1.usersService().findByEmail(googleUser.email);
            if (!user) {
                user = await new usersService_1.usersService().create({
                    name: googleUser.name,
                    email: googleUser.email,
                    password: await bcryptjs_1.default.hash(String(Math.random()), 10),
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
    }
    async sendPasswordResetLink(req, res) {
        const { email } = req.body;
        if (!email)
            return res.status(400).send({
                message: 'no email received'
            });
        try {
            const user = await new usersService_1.usersService().findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const resetPasswordToken = jwtToken_1.jwtToken.jwtEncoded(user.id);
            const resetLink = `http://localhost:3000/reset-password/${resetPasswordToken}`;
            console.log(resetPasswordToken);
            functions_1.utilsFn.sendConfirmationEmail(user.name, user.email, resetLink);
            return res.status(200).json({ message: 'Password reset link sent to your email' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }
    ;
    async updatePasswordWithToken(req, res) {
        const { password } = req.body;
        const { token } = req.params;
        if (!password || !token)
            return res.status(400).send({ message: 'You forgot to send the password or the token or both' });
        try {
            let hashPassword = await bcryptjs_1.default.hash(String(password), 10);
            let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
            if (!data)
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            let user = await new usersService_1.usersService().findbyId(data.id);
            if (!user) {
                return res.status(400).json({ message: 'no user found' });
            }
            await new usersService_1.usersService().updatePassword(user.id, hashPassword);
            user.password = null;
            await new usersService_1.usersService().updateStatus(user.id, 'Active');
            let cookieToken = jwtToken_1.jwtToken.jwtEncoded(user.id);
            console.log(cookieToken);
            res.cookie('jwt', cookieToken, { httpOnly: true });
            return res.json(user);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }
    ;
}
exports.UsersController = UsersController;
