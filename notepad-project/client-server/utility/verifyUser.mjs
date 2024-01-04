import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyUser = (req) => {
  const id = req.params.id;

  if (req.cookies.refreshToken) {
    try {
      const refreshToken = req.cookies.refreshToken; 
      const userData = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      console.log('userData decoded from refresh token: ', userData);

      if (userData.is_logined === true && id === userData.id && userData.iss === process.env.ISSUER) {
        return true;
      }
    } catch (err) {
      return false;
    }
  } else if (req.session) {
    if (req.session.is_logined && req.session.userId === id) {
      return true;
    } 
  }

  return false;
};

export default verifyUser;