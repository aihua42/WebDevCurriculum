import express from 'express';

// import controllers
import signup from '../controllers/signup.mjs';
import loginSess from "../controllers/loginSess.mjs";
import logoutSess from '../controllers/logoutSess.mjs';
import loginJWT from '../controllers/loginJWT.mjs';
import logoutJWT from '../controllers/logoutJWT.mjs';

const router = express.Router();

router.post('/login', loginSess);
router.post('/user/:id', logoutSess);

// router.post('/login', loginJWT);
// router.post('/user/:id', logoutJWT);

router.post('/signup', signup);

export default router;