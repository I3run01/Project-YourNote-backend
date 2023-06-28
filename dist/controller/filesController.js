"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const jwtToken_1 = require("../auth/jwtToken");
const filesService_1 = require("../services/filesService");
class FilesController {
    async createFile(req, res) {
        try {
            const token = req.cookies['jwt'];
            let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
            let userID = data.id;
            if (!data) {
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            }
            const files = await new filesService_1.FilesService().createNewFile(userID);
            return res.json(files);
        }
        catch (err) {
            return res.status(401).json({ err });
        }
    }
    async getFiles(req, res) {
        try {
            const token = req.cookies['jwt'];
            let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
            let userID = data.id;
            if (!data) {
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            }
            const files = await new filesService_1.FilesService().getFilesByUserId(userID);
            return res.json(files);
        }
        catch (err) {
            return res.status(401).json({ err });
        }
    }
    async getFile(req, res) {
        try {
            const fileID = req.params.fileID;
            if (!fileID) {
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            }
            const file = await new filesService_1.FilesService().getFileById(fileID);
            return res.json(file);
        }
        catch (err) {
            return res.status(401).json({ err });
        }
    }
    async deleteFile(req, res) {
        try {
            const fileID = req.params.fileID;
            const token = req.cookies['jwt'];
            let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
            let userID = data.id;
            let hasAuth = await new filesService_1.FilesService().hasAuthToEditTheFile(userID, fileID);
            if (!hasAuth) {
                return res.status(404).json({
                    message: 'Unauthorized user or file not found',
                });
            }
            if (!fileID) {
                return res.status(400).json({
                    message: 'Bad Request: No file ID provided',
                });
            }
            const deletedFile = await new filesService_1.FilesService().deleteFileById(fileID);
            if (!deletedFile) {
                return res.status(404).json({
                    message: 'File not found',
                });
            }
            return res.json({ message: 'File deleted successfully' });
        }
        catch (err) {
            return res.status(500).json({ err });
        }
    }
    async updateFileTitle(req, res) {
        try {
            const fileID = req.params.fileID;
            const newTitle = req.body.title;
            const token = req.cookies['jwt'];
            let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
            if (!data) {
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            }
            let userID = data.id;
            let hasAuth = await new filesService_1.FilesService().hasAuthToEditTheFile(userID, fileID);
            if (!hasAuth) {
                return res.status(404).json({
                    message: 'Unauthorized user or file not found',
                });
            }
            if (!fileID || !newTitle) {
                return res.status(400).json({
                    message: 'Bad Request: Missing file ID or new title',
                });
            }
            const updatedFile = await new filesService_1.FilesService().changeFileTitle(fileID, newTitle);
            if (!updatedFile) {
                return res.status(404).json({
                    message: 'File not found',
                });
            }
            return res.json({ message: 'File title updated successfully', file: updatedFile });
        }
        catch (err) {
            return res.status(500).json({ err });
        }
    }
    async updateFileContent(req, res) {
        try {
            const fileID = req.params.fileID;
            let newContent = req.body.content;
            newContent = JSON.parse(newContent);
            if (!fileID || !newContent) {
                return res.status(400).json({
                    message: 'Bad Request: Missing file ID or new Content',
                });
            }
            const token = req.cookies['jwt'];
            let data = JSON.parse(jwtToken_1.jwtToken.jwtDecoded(token));
            if (!data) {
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            }
            let userID = data.id;
            let hasAuth = await new filesService_1.FilesService().hasAuthToEditTheFile(userID, fileID);
            if (!hasAuth) {
                return res.status(404).json({
                    message: 'Unauthorized user or file not found',
                });
            }
            const updatedFile = await new filesService_1.FilesService().changeFileContent(fileID, newContent);
            if (!updatedFile) {
                return res.status(404).json({
                    message: 'File not found',
                });
            }
            return res.json({ message: 'File content updated successfully', file: updatedFile });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.FilesController = FilesController;
