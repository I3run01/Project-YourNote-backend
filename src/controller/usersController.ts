import { Request, Response, response } from 'express';
import bcrypt from 'bcryptjs'
import { usersService } from '../services/usersService';
import CreateUserDto from '../dto/userDTO'
import { jwtToken } from '../auth/jwtToken'
import { confirmationEmailToken } from '../auth/jwtToken'
import { utilsFn } from '../utils/functions'
import { requests } from '../utils/functions'

export class UsersController {

    ping(req: Request, res: Response) {
        res.json({ pong: true })
    }

    async signUp(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ 
            message: 'invalide credentials'
        });

        let user = await new usersService().findByEmail(email);

        if (user) return res.status(400).json({
            message: 'user already exists'
        });

        const UserDto: CreateUserDto = {
            name: null,
            email,
            password: await bcrypt.hash(password, 10),
            avatarImage: null,
        };

        try {
            let newUser = await new usersService().create(UserDto);

            const confirmationCode:string = confirmationEmailToken.jwtEncoded(newUser.id)
            
            newUser.password = null;

            utilsFn.sendConfirmationEmail(UserDto.name, UserDto.email, confirmationCode)

            return res.json(newUser);

        } catch (error) {
            return res.status(500).json(error)
        }

    }

    async signIn (req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await new usersService().findByEmail(email)

        try {
            if (!user || !user?.password === null) return res.status(400).json({
                message: 'no user found',
            });

            
            else if (! await bcrypt.compare(password, user.password as string)) return res.status(401).json({
                message: 'invalid credentials',
            });

            else if (user.status !== "Active") {

                const confirmationCode:string = confirmationEmailToken.jwtEncoded(user.id)
                 
                //utilsFn.sendConfirmationEmail(user.name, user.email, 'confirmationCode')

                return res.status(401).json({
                    message: "Pending Account. Please Verify Your Email!, a new link was sent in your email",
                })
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

            if (!data) return res.status(400).json({
                message: 'Unauthorized request',
            });
            

            let user = await new usersService().findbyId(data.id)

            if (!user) {
                return res.status(400).json({
                  message: "No user found",
                });
            }

            if (user.status !== "Active") {

                const confirmationCode:string = confirmationEmailToken.jwtEncoded(user.id)
                 
                //utilsFn.sendConfirmationEmail(user.name, user.email, 'confirmationCode')
                
                return res.status(401).json({
                      message: "Pending Account. Please Verify Your Email!. We sent a new link to your email",
                });
            }
            

            return res.json(user)

        } catch {
            return res.status(401).json({
                message: 'Unauthorized request',
            });
        }
    }

    async deleteOne (req: Request, res: Response) {
        const token = await req.cookies['jwt']

        if (!token) return res.status(400).json({
            message: 'no token has been sent',
        })
        
        const data = JSON.parse(jwtToken.jwtDecoded(token))

        try {
            return res.json(await new usersService().deleteOne(data.id))
        } catch (error) {
            return res.status(500).json(error)
        }
        
    }

    async googleSignIn (req: Request, res: Response) {
        const { googleToken } = req.body;

        if(!googleToken) return res.status(400).json({message: 'no token sent'})

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
            return res.status(500).json(error)
        }
    }

    async emailConfirmation (req: Request, res: Response) {
        const { tokenConfirmation } = req.params

        try {
            let data = JSON.parse(confirmationEmailToken.jwtDecoded(tokenConfirmation))
    
            if (!data) return res.status(400).json({
                message: 'invalid token',
            });
            
            let user = await new usersService().findbyId(data.id)    

            if (!user) return res.status(400).json({
                message: 'no user found',
            });

            await new usersService().updateStatus(user.id, 'Active')

            let token: string = jwtToken.jwtEncoded(user.id)

            res.cookie('jwt', token, { httpOnly: true })
    
            return res.json(user)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}