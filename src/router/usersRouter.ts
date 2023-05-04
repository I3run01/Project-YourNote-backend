import { Router } from "express";
import { UsersController } from "../controller/usersController";

const router = Router()

router.get('/ping', new UsersController().ping)
router.get('/signout', new UsersController().signOut)
router.get('/confirm-email/:token', new UsersController().emailConfirmation)
router.get('', new UsersController().user)
router.post('/signin', new UsersController().signIn)
router.post('/signup', new UsersController().signUp)
router.post('/google-signin', new UsersController().googleSignIn)
router.post('/forgot-password', new UsersController().sendPasswordResetLink);
router.post('/reset-password/:token', new UsersController().updatePasswordWithToken)
router.delete('', new UsersController().deleteOne)
router.delete('', new UsersController().deleteOne)

export default router