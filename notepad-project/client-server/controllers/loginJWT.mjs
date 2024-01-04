import fs from "fs/promises";
import getPath from "../utility/getPath.mjs";
import createToken from '../utility/createToken.mjs';
import tokenOptions from '../utility/tokenOptions.mjs';
import dotenv from 'dotenv';

dotenv.config();

const loginJWT = (req, res) => {
  const { id, pw } = req.body;
  console.log('login info: ', [id, pw]);

  const userPath = getPath(import.meta.url, "controllers", ['users', `${id}.json`]);
  
  fs.readFile(userPath)
  .then((file) => {
    const user = JSON.parse(file);  

    if (pw !== user.pw) {  
      res.status(209).json({ success: false, message: 'Passwords do NOT match' });
      return;
    }

    try {
      // access token
      const accessToken = createToken(id, 'access');

      // refresh token, access token 갱신 용도. access token이 expired 됐을 때 
      const refreshToken = createToken(id, 'refresh');
      
      // send cookie
      res.cookie('accessToken', accessToken, tokenOptions);
      res.cookie('refreshToken', refreshToken, tokenOptions);
  
      res.status(201).json({ success: true, message: 'Successfully login' });
    } catch (err) {
      console.error('Failed to log in', err);
      res.status(500).json({ success: false, message: 'Failed to create tokens' });
    }
  })
  .catch((err) => {
    console.error('Failed to log in', err);
    res.status(204).json({ success: false, message: 'User not found' });
  });
};

export default loginJWT;