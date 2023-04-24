import { Router } from "express";
import { UsersController } from "../controller/usersController";

const router = Router()

router.get('/api/users/ping', UsersController.ping)
router.get('/api/users/signout', UsersController.signOut)
router.get('/api/users', UsersController.user)
router.post('/api/users/signup', UsersController.signUp)
router.post('/api/users/signin', UsersController.signIn)

export default router