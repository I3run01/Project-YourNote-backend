import { Document, Schema, Model, model } from "mongoose";

interface IUser {
    name?: string;
    email: string;
    password?: string;
    avatarImage?: string;
    status: 'Pending' | 'Active';
}

// 2. Define the corresponding schema for the user collection.
const UserSchema: Schema = new Schema({
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


interface UserDocument extends IUser, Document {}


const UserModel: Model<UserDocument> = model<UserDocument>("User", UserSchema);

export default UserModel;
