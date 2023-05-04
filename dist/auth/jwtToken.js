"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newToken = exports.jwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.jwtToken = {
    jwtEncoded: (id) => {
        return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '180d' });
    },
    jwtDecoded: (token) => {
        return JSON.stringify(jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY));
    }
};
exports.newToken = {
    jwtEncoded: (id) => {
        return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
    },
    jwtDecoded: (token) => {
        return JSON.stringify(jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY));
    },
};
