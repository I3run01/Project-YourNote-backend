import { connect } from "mongoose";

export const mongoConnect = () => {
    try {
        connect(process.env.MONGO_URL as string)
    } catch(error) {
        console.log('mongoDB connection error:', error)
    }
}