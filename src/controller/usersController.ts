import { Request, Response, response } from 'express';
import bcrypt from 'bcryptjs'
import { usersService } from '../services/usersService';
import CreateUserDto from '../dto/usersDTO'
import { jwtToken } from '../auth/jwtToken'
import { mailServices } from '../utils/functions'
import { apiRequest } from '../utils/functions'

export class UsersController {

    async signUp(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) return res.status(400).json({ 
                message: 'invalide credentials'
            });

            let user = await new usersService().findByEmail(email);

            if (user?.status !== "Active" && user) {

                const confirmationCode:string = jwtToken.jwtEncoded(user.id)

                const emailConfirmationLink = `https://yournote.cloud/emailConfirmation/${confirmationCode}`

                
                
                mailServices.sendConfirmationEmail(user.email, emailConfirmationLink, user?.name)

                return res.status(401).json({
                    message: "Pending Account. Please Verify Your Email!, a new link was sent in your email",
                })
            }
            

            if (user) return res.status(400).json({
                message: 'user already exists'
            });

            const UserDto: CreateUserDto = {
                name: null,
                email,
                password: await bcrypt.hash(password, 10),
                avatarImage: null,
            };

            
            let newUser = await new usersService().create(UserDto);

            const confirmationCode:string = jwtToken.jwtEncoded(newUser.id)

            const emailConfirmationLink = `https://yournote.cloud/emailConfirmation/${confirmationCode}`
                
            mailServices.sendConfirmationEmail(UserDto.email, emailConfirmationLink, UserDto?.name as string)

            return res.json(newUser);

        } catch (error) {
            return res.status(500).json(error)
        }

    }

    async signIn (req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await new usersService().findByEmail(email)
        
            if (!user || !user?.password === null) return res.status(400).json({
                message: 'no user found',
            });

            
            if (! await bcrypt.compare(password, user.password as string)) return res.status(401).json({
                message: 'invalid credentials',
            });

            if (user.status !== "Active") {

                const confirmationCode:string = jwtToken.jwtEncoded(user.id)

                console.log(confirmationCode)

                const emailConfirmationLink = `https://yournote.cloud/emailConfirmation/${confirmationCode}`
                 
                mailServices.sendConfirmationEmail(user.email, emailConfirmationLink, user.name)

                return res.status(401).send({
                    message: "Pending Account. Please Verify Your Email!, a new link was sent in your email",
                })
            }
            
            let token: string = jwtToken.jwtEncoded(user.id)
            
            res.cookie('jwt', token, { sameSite: 'none', secure: true })

            user.password = ''

            return res.json(user)
        } catch (error) {
            return res.status(500).json(error)
        }

    }

    async user (req: Request, res: Response) {
        try {
            const token = await req.cookies['jwt']

            let data = JSON.parse(jwtToken.jwtDecoded(token))

            if (!data) return res.status(401).json({
                message: 'Unauthorized request',
            });

            let user = await new usersService().findbyId(data.id)

            if (!user) {
                return res.status(400).json({
                  message: "No user found",
                });
            }

            if (user.status !== "Active") {

                const confirmationCode:string = jwtToken.jwtEncoded(user.id)
                 
                mailServices.sendConfirmationEmail(user.email, confirmationCode, user.name)
                
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

    async emailConfirmation (req: Request, res: Response) {
        try {
            const { token } = req.params

            let data = JSON.parse(jwtToken.jwtDecoded(token))
    
            if (!data) return res.status(400).json({
                message: 'invalid token',
            });
            
            let user = await new usersService().findbyId(data.id)    

            if (!user) return res.status(400).json({
                message: 'no user found',
            });

            await new usersService().updateStatus(user.id, 'Active')

            let userToken: string = jwtToken.jwtEncoded(user.id)

            res.cookie('jwt', userToken, { sameSite: 'none', secure: true })
    
            return res.json(user)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async signOut (req: Request, res: Response) {
        try {
            res.clearCookie('jwt');

            return res.json({ message: 'success' })
        } catch(error) {
            return res.status(500).json(error)
        }
        
    }

    async deleteOne (req: Request, res: Response) {
        try {
            const token = await req.cookies['jwt']

            if (!token) return res.status(400).json({
                message: 'no token has been sent',
            })
            
            const data = JSON.parse(jwtToken.jwtDecoded(token))

            return res.json(await new usersService().deleteUser(data.id))
        } catch (error) {
            return res.status(500).json(error)
        }
        
    }

    async googleSignIn (req: Request, res: Response) {
        try {
            const { googleToken } = req.body;

            if(!googleToken) return res.status(400).json({message: 'no token sent'})

            let googleUser = JSON.parse(await apiRequest.googleLogin(googleToken))
 
            let user = await new usersService().findByEmail(googleUser.email)

            if (!user) {
                user = await new usersService().create({
                    name: googleUser.name,
                    email: googleUser.email,
                    password: await bcrypt.hash(String(Math.random()), 10),
                    avatarImage:googleUser.picture,
                });
            }

            if(user.status != 'Active') {
                await new usersService().updateStatus(user.id, 'Active')
            }

            let userToken: string = jwtToken.jwtEncoded(user.id)
    
            user.password = ''
            res.cookie('jwt', userToken, { sameSite: 'none', secure: true })
            
            return res.json(user)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async sendPasswordResetLink (req: Request, res: Response) {
        try {

            const { email } = req.body;

            if(!email) return res.status(400).send({
                message: 'no email received'
            })
  
            const user = await new usersService().findByEmail(email);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
      
            const resetPasswordToken = jwtToken.jwtEncoded(user.id);

            const resetLink = `https://yournote.cloud/reset-password/${resetPasswordToken}`;
        
            mailServices.sendConfirmationEmail(user.email, resetLink, user.name)

            return res.status(200).json({ message: 'Password reset link sent to your email' });
        } catch (error) {
            return res.status(500).json(error);
        }
      };

    async updatePasswordWithToken(req: Request, res: Response) {
        try {
            const { password } = req.body;
            const { token } = req.params

            if(!password || !token) return res.status(400).send({message: 'You forgot to send the password or the token or both'})

            let hashPassword:string = await bcrypt.hash(String(password), 10)
            
            let data = JSON.parse(jwtToken.jwtDecoded(token))

            if (!data) return res.status(401).json({
                message: 'Unauthorized request',
            });

            let user = await new usersService().findbyId(data.id)

            if (!user) {
                return res.status(400).json({ message: 'no user found' });
            }
        
            await new usersService().updatePassword(user.id, hashPassword)

            user.password = ''

            await new usersService().updateStatus(user.id, 'Active')

            let cookieToken: string = jwtToken.jwtEncoded(user.id)
            
            res.cookie('jwt', cookieToken, { sameSite: 'none', secure: true })
        
            return res.json(user);

        } catch (error) {

            console.error(error);

            return res.status(500).json(error);
        }
    };
}