
import { Router } from "express";

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

router.post(REGISTRATION);
router.post(LOGIN);
router.post(LOGOUT);
router.get(ACTIVATE_BY_LINK);
router.get(REFRESH);
router.get(USERS);
