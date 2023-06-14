"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailServices = exports.apiRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const nodemailer_1 = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.apiRequest = {
    async googleLogin(token) {
        let googleUser = await axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });
        return JSON.stringify(googleUser.data);
    },
};
exports.mailServices = {
    sendConfirmationEmail(email, link, name) {
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;
        const transport = (0, nodemailer_1.createTransport)({
            service: "outlook",
            auth: {
                user: user,
                pass: pass,
            },
        });
        try {
            transport.sendMail({
                from: user,
                to: email,
                subject: "yourNode Code",
                html: `<h1>Email Confirmation</h1>
              <h2>Hello ${name ? name : ''}</h2>
              <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
              <a href=${link}> Click here</a>
              </div>`,
            });
        }
        catch (error) {
            console.log(error);
        }
    },
};
