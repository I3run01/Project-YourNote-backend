import { Router } from 'express';
import { UsersController } from '../controller/usersController';

const router = Router();
const usersController = new UsersController();

router.get('/signout', usersController.signOut);
router.get('/confirm-email/:token', usersController.emailConfirmation);
router.get('/', usersController.user);
router.post('/signin', usersController.signIn);
router.post('/signup', usersController.signUp);
router.post('/google-signin', usersController.googleSignIn);
router.post('/forgot-password', usersController.sendPasswordResetLink);
router.post('/reset-password/:token', usersController.updatePasswordWithToken);
router.delete('/', usersController.deleteOne);

export default router;
