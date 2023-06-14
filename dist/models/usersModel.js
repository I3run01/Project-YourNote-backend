"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// 2. Define the corresponding schema for the user collection.
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatarImage: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    }
});
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
