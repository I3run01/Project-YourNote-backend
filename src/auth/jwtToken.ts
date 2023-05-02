import jwt from 'jsonwebtoken';

export const jwtToken = {
    jwtEncoded: (id: string): string => {
        return jwt.sign({id}, process.env.JWT_SECRET_KEY as string, {expiresIn: '180d'});
    },

    jwtDecoded: (token: string): string => {
        return JSON.stringify(jwt.verify(token, process.env.JWT_SECRET_KEY as string))
    }
}

export const confirmationEmailToken = {
    jwtEncoded: (): string => {
        const payload = {
            num1: 123,
            num2: 456,
            num3: 789,
            num4: 1011,
        };


        return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {expiresIn: '10m'});
    },
}
