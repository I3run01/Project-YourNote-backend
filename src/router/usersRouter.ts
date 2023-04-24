import { Router } from "express";
import { UsersController } from "../controller/usersController";

const router = Router()

router.get('/api/users/ping', UsersController.ping)
router.post('/api/users/signup', UsersController.signUp)

export default router