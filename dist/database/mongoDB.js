"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnect = void 0;
const mongoose_1 = require("mongoose");
const mongoConnect = () => {
    try {
        (0, mongoose_1.connect)(process.env.MONGO_URL);
    }
    catch (error) {
        console.log('mongoDB connection error:', error);
    }
};
exports.mongoConnect = mongoConnect;
