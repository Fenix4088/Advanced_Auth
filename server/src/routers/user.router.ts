
import { Router } from "express";
import {check} from 'express-validator';
import UserController from '../controllers/user.controller';

const router = Router();

enum ENDPOINTS  {
      REGISTRATION = '/registration',
      LOGIN = '/login',
      LOGOUT = '/logout',
      ACTIVATE_BY_LINK = '/activate/:link',
      REFRESH = '/refresh',
      USERS = '/users',
}
const {REGISTRATION, LOGIN, LOGOUT, ACTIVATE_BY_LINK, REFRESH, USERS} = ENDPOINTS;

router.post(REGISTRATION, ...[
      check('email', 'Invalid email').isEmail().notEmpty(),
      check('password', `Password should not be shorter then 5 symbols and not longer then 50`).isLength({min: 5, max: 50})
], (req, res, next) => UserController.registration(req, res, next));

router.post(LOGIN, (req, res, next) => UserController.login(req, res, next));

router.post(LOGOUT, (req, res, next) => UserController.logout(req, res, next));

router.get(ACTIVATE_BY_LINK, (req, res, next) => UserController.activate(req, res, next)); 
router.get(REFRESH, (req, res, next) => UserController.refresh(req, res, next));

router.get(USERS, (req, res, next) => UserController.getUsers(req, res, next));

export default router;
