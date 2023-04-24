import jwt from 'jsonwebtoken';

export const jwtToken = (id: string): string => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY as string, {expiresIn: '180d'});
}