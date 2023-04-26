import { Request, Response, response } from 'express';
import bcrypt from 'bcryptjs'
import { usersService } from '../services/usersService';
import CreateUserDto from '../dto/userDTO'
import { jwtToken } from '../auth/jwtToken'

export const UsersController = {

    ping: (req: Request, res: Response) => {
        res.json({pong: true})
    },

    signUp: async (req: Request, res: Response) => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400)
            return res.json({
                message: 'invaid credentials',
                error: 'bad request'
            });
        }

        let user = await usersService.findByEmail(email);

        if (user) {
            res.status(400)
            return res.json({
                message: 'user already exists',
                error: 'bad request'
            });
        }

        const createUserDto: CreateUserDto = {
            name: null,
            email,
            password: await bcrypt.hash(password, 10),
            avatarImage: null,
        };

        user = await usersService.create(createUserDto);

        user.password = null;

        let token: string = jwtToken.jwtEncoded(user.id)

        res.cookie('jwt', token, {httpOnly: true})
        
        return res.json(user);
    },
    
    signIn: async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await usersService.findByEmail(email)

        if(!user || !user?.password === null) {
            res.status(400)
            return res.json({
                message: 'invalid credentials',
                error: 'bad request'
            });
        }

        if(! await bcrypt.compare(password, user.password as string)) {
            res.status(400)
            return res.json({
                message: 'invalid credentials',
                error: 'bad request'
            });
        }

        let token: string = jwtToken.jwtEncoded(user.id)

        res.cookie('jwt', token, {httpOnly: true})

        user.password = null

        return res.json(user)
    },

    signOut: async (req: Request, res: Response) => {
        res.clearCookie('jwt');

        return res.json({ message: 'success'})
    },

    user: async (req: Request, res: Response) => {
        try {
            const token = await req.cookies['jwt']

            let data = JSON.parse(jwtToken.jwtDecoded(token))

            if(!data) {
                return res.json({
                    message: 'Unauthorized request',
                    error: 'bad request'
                });
            }
            
            let user = await usersService.findById(data.id)

            if(!user) {
                res.status(400)
                return res.json({
                    message: 'no user has been found',
                    error: 'bad request'
                });
            }
 
            return res.json(user)

        } catch {
            return res.json({
                message: 'Unauthorized request',
                error: 'bad request'
            });
        }
    },

    deleteOne: async (req: Request, res: Response) => {
        const token = await req.cookies['jwt']

        if(!token) {
            res.status(400)
            return res.json({
                message: 'no token has been sent',
                error: 'bad request'
            })
        }

        const data = JSON.parse(jwtToken.jwtDecoded(token))

        return res.json(await usersService.deleteOne(data.id))
    },

    googleSignIn: async (req: Request, res: Response) => {
        const { email, picture, name } = req.body;

        if (!email || !picture || !name) {
            res.status(400)
            return res.json({
                message: 'invaid credentials',
                error: 'bad request'
            });
        }

        let user = await usersService.findByEmail(email)

        if(!user) {
            user = await usersService.create({
                name,
                email,
                password: await bcrypt.hash(String(Math.random()), 10),
                avatarImage: picture
            });
        }

        let token: string = jwtToken.jwtEncoded(user.id)

        user.password = null

        res.cookie('jwt', token, {httpOnly: true})

        return res.json(user)
    }
}