"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controller/usersController");
const router = (0, express_1.Router)();
router.get('/api/users/ping', usersController_1.UsersController.ping);
router.post('/api/users/signup', usersController_1.UsersController.signUp);
exports.default = router;
