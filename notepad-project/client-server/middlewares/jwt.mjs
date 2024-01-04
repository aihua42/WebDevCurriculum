import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createToken from '../utility/createToken.mjs';
import tokenOptions from '../utility/tokenOptions.mjs';

dotenv.config();

// access token 재발급
const jwtMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // access token이 만료, freshToken 존재, loggin 상태
  if (!accessToken && refreshToken) {
    console.log(`access token expired at: `, new Date());

    try {
      const userData = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const userId = userData.id;
      console.log('userData in jwt middleware: ', userData);

      if (req.params.id === userId) {
        const token = createToken(userId, 'access');
        res.cookie('accessToken', token, tokenOptions);
      }
    } catch(err) {
      console.error('Failed to verify refresh access token', err);
      res.status(405), json({ success: false, message: 'Failed to verify refresh access token' });
    }
  } 

  next();
};

export default jwtMiddleware;