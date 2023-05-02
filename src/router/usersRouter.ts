import { Router } from "express";
import { UsersController } from "../controller/usersController";

const router = Router()

router.get('/ping', new UsersController().ping)
router.get('/signout', new UsersController().signOut)
router.get('/confirm/:tokenConfirmation', new UsersController().emailConfirmation)
router.get('', new UsersController().user)
router.post('/signin', new UsersController().signIn)
router.post('/signup', new UsersController().signUp)
router.post('/googleSignin', new UsersController().googleSignIn)
router.delete('', new UsersController().deleteOne)
router.delete('', new UsersController().deleteOne)

export default router