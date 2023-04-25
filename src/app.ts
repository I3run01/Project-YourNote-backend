import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import usersRouter from './router/usersRouter'
import cookieParser from "cookie-parser";
import { mongoConnect } from './database/mongoDB'

dotenv.config()

mongoConnect()

const server = express()

server.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

server.use(cookieParser())

server.use(express.urlencoded({ extended: true}))

server.use('/api/users', usersRouter)

server.use((req: Request, res: Response) => {
    res.status(404)
    res.json({ error: 'Endpoint not found'})
})

export default server