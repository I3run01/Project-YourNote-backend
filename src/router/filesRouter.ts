import { Router } from 'express';
import { FilesController } from '../controller/filesController';

const router = Router();
const filesController = new FilesController();

router.get('/', filesController.getFiles);
router.get('/:fileID', filesController.getFile);
router.post('/', filesController.createFile);
router.delete('/:fileID', filesController.deleteFile)
router.put('/:fileID/title', filesController.updateFileTitle);


export default router;
