"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FilesSchema = new mongoose_1.Schema({
    userID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: [mongoose_1.Schema.Types.Mixed],
        required: false
    }
});
const FilesModel = (0, mongoose_1.model)("Files", FilesSchema);
exports.default = FilesModel;
