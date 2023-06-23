import { Router } from 'express';
import { FilesController } from '../controller/filesController';

const router = Router();
const usersController = new FilesController();

router.get('/', usersController.files);

export default router;
