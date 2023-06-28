"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const filesModel_1 = __importDefault(require("../models/filesModel")); // ensure correct path to your model file
class FilesService {
    model;
    constructor() {
        this.model = filesModel_1.default;
    }
    async hasAuthToEditTheFile(userId, fileID) {
        try {
            const file = await this.model.findById(fileID);
            if (file && file.userID == userId) {
                return true;
            }
            return false;
        }
        catch (err) {
            throw err;
        }
    }
    async getFilesByUserId(userId) {
        try {
            const files = await this.model.find({ userID: userId });
            return files;
        }
        catch (err) {
            throw err;
        }
    }
    async getFileById(fileID) {
        try {
            const file = await this.model.findById(fileID);
            return file;
        }
        catch (err) {
            throw err;
        }
    }
    async deleteFileById(fileID) {
        try {
            const file = await this.model.findByIdAndDelete(fileID);
            return file;
        }
        catch (err) {
            throw err;
        }
    }
    async createNewFile(userId) {
        try {
            const newFile = this.model.create({
                userID: userId,
                title: 'Untitled',
            });
            return newFile;
        }
        catch (err) {
            throw err;
        }
    }
    async changeFileTitle(fileID, newTitle) {
        try {
            const file = await this.model.findByIdAndUpdate(fileID, { title: newTitle }, { new: true });
            return file;
        }
        catch (err) {
            throw err;
        }
    }
    async changeFileContent(fileID, newContent) {
        try {
            const file = await this.model.findByIdAndUpdate(fileID, { content: newContent }, { new: true });
            return file;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.FilesService = FilesService;
