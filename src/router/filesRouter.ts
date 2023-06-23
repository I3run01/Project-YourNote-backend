import { Router } from 'express';
import { FilesController } from '../controller/filesController';

const router = Router();
const usersController = new FilesController();

router.get('/', usersController.getFiles);
router.get('/:fileID', usersController.getFile);
router.post('/', usersController.createFile);
router.delete('/:fileID', usersController.deleteFile)

export default router;
