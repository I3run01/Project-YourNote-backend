import jwt from 'jsonwebtoken';

export const jwtToken = (parameter: string): string => {
    return jwt.sign(
        parameter, 
        process.env.JWT_SECRET_KEY as string,
    );
}