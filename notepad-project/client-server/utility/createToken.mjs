import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createToken = (id, tokenType) => {
  const secret = tokenType === 'access' ? process.env.ACCESS_SECRET : process.env.REFRESH_SECRET;
  const maxAge = tokenType === 'access' ? '1m' : '24h';

  // token
  const token = jwt.sign(
    {
      id,
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