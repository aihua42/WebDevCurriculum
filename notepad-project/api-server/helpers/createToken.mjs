import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createToken = (userId, tokenType) => {
  const secret = tokenType === 'access' ? process.env.ACCESS_SECRET : process.env.REFRESH_SECRET;
  const maxAge = tokenType === 'access' ? '1h' : '24h';

  // token
  const token = jwt.sign(
    {
      userId,
      is_logined: true
    }, 
    secret, 
    {
      expiresIn: maxAge,
      issuer: 'notepad'
    }
  );

  console.log(`${tokenType} token: `, jwt.decode(token, secret));
  return token;
};

export default createToken;