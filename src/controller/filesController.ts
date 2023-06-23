import { Request, Response, response } from 'express';
import { jwtToken } from '../auth/jwtToken'

export class FilesController {
    
    async files(req: Request, res: Response) {

        try {
            const token = await req.cookies['jwt']

            let data = JSON.parse(jwtToken.jwtDecoded(token))

            if (!data) return res.status(401).json({
                message: 'Unauthorized request',
            });


            return res.json({message: 'ok'})
        } catch {
            return res.status(401).json({
                message: 'Unauthorized request',
            });
        }
    }
} 