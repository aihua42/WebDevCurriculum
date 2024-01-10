import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createToken = (payloadData, tokenType) => {
  const secret = tokenType === 'access' ? process.env.ACCESS_SECRET : process.env.REFRESH_SECRET;
  const maxAge = tokenType === 'access' ? '1h' : '24h';
  
  // token
  const token = jwt.sign(
    payloadData, 
    secret, 
    {
      expiresIn: maxAge,
      issuer: 'notepad'
    }
  );

  return token;
};

export default createToken;