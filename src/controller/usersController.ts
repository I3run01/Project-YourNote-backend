import { Request, Response, response } from 'express';
import bcrypt from 'bcryptjs'
import { usersService } from '../services/usersService';
import CreateUserDto from '../dto/userDTO'
import { jwtToken } from '../auth/jwtToken'
import { confirmationEmailToken } from '../auth/jwtToken'
import { requests } from '../utils/functions'

export class UsersController {

    ping(req: Request, res: Response) {
        res.json({ pong: true })
    }

    async signUp(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400)
            return res.json({
                message: 'invalid credentials',
                error: 'bad request'
            });
        }

        let user = await new usersService().findByEmail(email);

        if (user) {
            res.status(400)
            return res.json({
                message: 'user already exists',
                error: 'bad request'
            });
        }

        const confirtionToken = confirmationEmailToken.jwtEncoded()
        console.log(confirtionToken)

        const createUserDto: CreateUserDto = {
            name: null,
            email,
            password: await bcrypt.hash(password, 10),
            avatarImage: null,
            confirmationCode: '1010'
        };

        try {
            user = await new usersService().create(createUserDto);

            user.password = null;

            let token: string = jwtToken.jwtEncoded(user.id)

            res.cookie('jwt', token, { httpOnly: true })

            return res.json(user);

        } catch (error) {
            return res.status(500).json(error)
        }

    }

    async signIn (req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await new usersService().findByEmail(email)

        try {
            if (!user || !user?.password === null) {
                res.status(400)
                return res.json({
                    message: 'invalid credentials',
                    error: 'bad request'
                });
            }

            if (! await bcrypt.compare(password, user.password as string)) {
                res.status(400)
                return res.json({
                    message: 'invalid credentials',
                    error: 'bad request'
                });
            }

            let token: string = jwtToken.jwtEncoded(user.id)

            res.cookie('jwt', token, { httpOnly: true })

            user.password = null

            return res.json(user)
        } catch (error) {
            return res.status(500).json(error)
        }

    }

    async signOut (req: Request, res: Response) {
        res.clearCookie('jwt');

        return res.json({ message: 'success' })
    }

    async user (req: Request, res: Response) {
        try {
            const token = await req.cookies['jwt']

            let data = JSON.parse(jwtToken.jwtDecoded(token))

            if (!data) {
                return res.json({
                    message: 'Unauthorized request',
                    error: 'bad request'
                });
            }

            let user = await new usersService().findbyId(data.id)

            if (!user) {
                res.status(400)
                return res.json({
                    message: 'no user has been found',
                    error: 'bad request'
                });
            }

            return res.json(user)

        } catch {
            res.status(400)
            return res.json({
                message: 'Unauthorized request',
                error: 'bad request'
            });
        }
    }

    async deleteOne (req: Request, res: Response) {
        const token = await req.cookies['jwt']

        if (!token) {
            res.status(400)
            return res.json({
                message: 'no token has been sent',
                error: 'bad request'
            })
        }

        const data = JSON.parse(jwtToken.jwtDecoded(token))

        try {
            return res.json(await new usersService().deleteOne(data.id))
        } catch (error) {
            return res.status(500).json(error)
        }
        
    }

    async googleSignIn (req: Request, res: Response) {
        const { googleToken } = req.body;

        if(!googleToken) return res.status(400).send('no token sent')

        try {
            let googleUser = JSON.parse(await requests.googleLogin(googleToken))
 
            let user = await new usersService().findByEmail(googleUser.email)

            if (!user) {
                user = await new usersService().create({
                    name: googleUser.name,
                    email: googleUser.email,
                    password: await bcrypt.hash(String(Math.random()), 10),
                    avatarImage:googleUser.picture,
                });
            }
    
            let userToken: string = jwtToken.jwtEncoded(user.id)
    
            user.password = null
    
            res.cookie('jwt', userToken, { httpOnly: true })
            
            return res.json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
}