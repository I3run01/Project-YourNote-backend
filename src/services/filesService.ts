import FilesModel, { FilesDocument } from '../models/filesModel'; // ensure correct path to your model file
import { Model } from 'mongoose';

export class FilesService {
    private model: Model<FilesDocument>;

    constructor() {
        this.model = FilesModel;
    }

    async getFilesByUserId(userId: string): Promise<FilesDocument[]> {
        try {
            const files = await this.model.find({ userID: userId });
            return files;
        } catch (err) {
            throw err;
        }
    }

    async getFileById(fileID: string): Promise<FilesDocument | null> {
        try {
            const file = await this.model.findById(fileID);
            return file;
        } catch (err) {
            throw err;
        }
    }

    async deleteFileById(fileID: string): Promise<FilesDocument | null> {
        try {
            const file = await this.model.findByIdAndDelete(fileID);
            return file;
        } catch (err) {
            throw err;
        }
    }
    
    
    async createNewFile(userId: string): Promise<FilesDocument> {
        try {
            const newFile = this.model.create({
                userID: userId,
                title: 'Untitled',
            });

            return newFile
        } catch (err) {
            throw err;
        }
    }
}
