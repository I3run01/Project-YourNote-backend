import { Document, Schema, Model, model } from "mongoose";

interface IFiles {
    userID: string;
    title: string
    content: object[]
}

const FilesSchema: Schema = new Schema({
    userID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: [Schema.Types.Mixed],
        required: false
    }
});


export interface FilesDocument extends IFiles, Document {}

const FilesModel: Model<FilesDocument> = model<FilesDocument>("Files", FilesSchema);

export default FilesModel;
