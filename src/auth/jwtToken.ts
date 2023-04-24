import jwt from 'jsonwebtoken';

export const jwtToken = (parameter: string): string => {
    const expiryTimeSeconds = 180 * 24 * 60 * 60

    return jwt.sign({
            parameter,
            exp: expiryTimeSeconds
        }, 
        process.env.JWT_SECRET_KEY as string,
    );
}