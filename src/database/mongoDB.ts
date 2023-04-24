import { connect } from "mongoose";

export const mongoConnect = async () => {
    try {
        console.log('Connecting in MongoDB')
        await connect(process.env.MONGO_URL as string)
        console.log('MongoDB is successfully connected')
    } catch(error) {
        console.log('mongoDB connection error:', error)
    }
}