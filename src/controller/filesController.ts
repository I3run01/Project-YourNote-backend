import { Request, Response } from 'express';
import { jwtToken } from '../auth/jwtToken';
import { FilesService } from '../services/filesService'; // ensure the correct path to your service file

export class FilesController {

    async getFiles(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.cookies['jwt'];
            let data = JSON.parse(jwtToken.jwtDecoded(token));

            if (!data) {
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            }

            const files = await new FilesService().getFilesByUserId(data.id);

            return res.json({files});
        } catch (err: any) {
            return res.status(401).json({ err });
        }
    }

    async getFile(req: Request, res: Response): Promise<Response> {
        try {
            const fileID = req.params.fileID;
    
            if (!fileID) {
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            }
    
            const file = await new FilesService().getFileById(fileID);
    
            return res.json({file});

        } catch (err: any) {
            return res.status(401).json({ err });
        }
    }

    async deleteFile(req: Request, res: Response): Promise<Response> {
        try {
            const fileID = req.params.fileID;
            
            if (!fileID) {
                return res.status(400).json({
                    message: 'Bad Request: No file ID provided',
                });
            }

            const deletedFile = await new FilesService().deleteFileById(fileID);

            if (!deletedFile) {
                return res.status(404).json({
                    message: 'File not found',
                });
            }

            return res.json({message: 'File deleted successfully'});
            
        } catch (err: any) {
            return res.status(500).json({ err });
        }
    }

    async createFile(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.cookies['jwt'];
            let data = JSON.parse(jwtToken.jwtDecoded(token));

            if (!data) {
                return res.status(401).json({
                    message: 'Unauthorized request',
                });
            }

            const files = await new FilesService().createNewFile(data.id);

            return res.json({files});
        } catch (err: any) {
            return res.status(401).json({ err });
        }
    }
}
