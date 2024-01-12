import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createToken = (data, tokenType) => {
  const secret = tokenType === 'access' ? process.env.ACCESS_SECRET : process.env.REFRESH_SECRET;
  const maxAge = tokenType === 'access' ? 60 * 60 : 7 * 24 * 60 * 60;  // 1h for accessToken; 1w for refreshToken
  
  // token
  const token = jwt.sign(
    data, 
    secret, 
    {
      expiresIn: maxAge,
      issuer: 'notepad'
    }
  );

  return token;
};

export default createToken;