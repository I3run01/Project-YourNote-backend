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

        let token: string = jwtToken(user.id)

        res.cookie('jwt', token, {httpOnly: true})
        
        return res.json(user);
    },
}