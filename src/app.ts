import express, {Request, Response, ErrorRequestHandler} from 'express'
import path from 'path'
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
server.use(express.static(path.join(__dirname, '../public')))
server.use(express.urlencoded({ extended: true}))
server.use('/api/users' ,usersRouter)

server.use((req: Request, res: Response) => {
    res.status(404)
    res.json({ error: 'Endpoint not found'})
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(400)
    console.log(err)
    res.json({error: 'OK'})
}

server.use(errorHandler)

export default server