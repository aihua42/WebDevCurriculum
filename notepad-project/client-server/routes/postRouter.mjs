import express from 'express';

// import controllers
import loginSess from "../controllers/loginSess.mjs";
import logoutSess from '../controllers/logoutSess.mjs';
import signup from '../controllers/signup.mjs';

const router = express.Router();

router.post('/login', loginSess);

router.post('/logout', logoutSess);

router.post('/signup', signup);

export default router;