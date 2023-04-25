import { Request, Response, response } from 'express';
import { hash, compare as bcryptCompare } from 'bcrypt';
import { usersService } from '../services/usersService';
import CreateUserDto from '../dto/userDTO'
import { jwtToken } from '../auth/jwtToken'

export const UsersController = {

    ping: (req: Request, res: Response) => {
        res.json({pong: true})
    },

    signUp: async (req: Request, res: Response) => {
        const { email, password } = req.body;

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
            password: await hash(password, 10),
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

        if(!user) {
            res.status(400)

            return res.json({
                message: 'invaid credentials',
                error: 'bad request'
            });
        }

        if(! await bcryptCompare(password, user.password as string)) {
            res.status(400)

            return res.json({
                message: 'invaid credentials',
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

            console.log(data)

            if(!data) {
                return res.json({
                    message: 'Unauthorized request',
                    error: 'bad request'
                });
            }
            
            let user = await usersService.findById(data.id)

            console.log(user)

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

        const data = JSON.parse(jwtToken.jwtDecoded(token))

        return res.json(await usersService.deleteOne(data.id))
    },

    googleSignIn: async (req: Request, res: Response) => {
        const { email, picture, name } = req.body;

        let user = await usersService.findByEmail(email)

        if(!user) {
            user = await usersService.create({
                name,
                email,
                password: await hash(String(Math.random()), 10),
                avatarImage: picture
            });
        }

        let token: string = jwtToken.jwtEncoded(user.id)

        user.password = null

        res.cookie('jwt', token, {httpOnly: true})

        return res.json(user)
    }
}