import { Schema,Model, model, connection } from "mongoose";

type UsersType = {
    name: string | null
    email: string
    password: string | null
    avatarImage: string | null
}

const schema = new Schema<UsersType>({
    name: {type: String || null, required: false},
    email: {type: String || null, required: true},
    password: {type: String, required: true},
    avatarImage: {type: String || null, required: false},
    status: {type: String, required: true}
})

const modelName: string = 'users'
const usersModel = connection && connection.models[modelName] ? (connection.models[modelName] as Model<UsersType>) : model<UsersType>(modelName, schema)

export default usersModel