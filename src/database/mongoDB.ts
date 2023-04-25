import { connect, disconnect } from "mongoose";

export const mongoConnect = async () => {
    try {
        console.log('Connecting in MongoDB')
        await connect(process.env.MONGO_URL as string)
        console.log('MongoDB is successfully connected')
    } catch(error) {
        console.log('mongoDB connection error:', error)
    }
}

export async function mongoDisconnect() {
    try {
      await disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
}