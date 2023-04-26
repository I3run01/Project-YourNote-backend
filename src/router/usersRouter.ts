import { Router } from "express";
import { UsersController } from "../controller/usersController";

const router = Router()

router.get('/ping', UsersController.ping)
router.get('/signout', UsersController.signOut)
router.get('', UsersController.user)
router.post('/signin', UsersController.signIn)
router.post('/signup', UsersController.signUp)
router.post('/googleSignin', UsersController.googleSignIn)
router.delete('', UsersController.deleteOne)
router.delete('', UsersController.deleteOne)

export default router