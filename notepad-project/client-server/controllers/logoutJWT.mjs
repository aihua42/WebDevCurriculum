import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const logoutJWT = (req, res) => {
  try { 
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'Token is expired' });
      return;
    }

    const accessToken = req.cookies.accessToken; 
    const acc_payload = jwt.decode(accessToken, process.env.REFRESH_SECRET);
    const ref_payload = jwt.decode(refreshToken, process.env.REFRESH_SECRET); 
    console.log('access token just before logout: ', acc_payload);

    if (req.body.id !== ref_payload.id || ref_payload.id !== acc_payload.id) {
      res.status(409).json({ success: false, message: 'User id does NOT match' });
      return;
    }

    if (acc_payload.is_logined !== true || ref_payload.is_logined !== true) {
      res.status(500).json({ success: false, message: `User ${id} is not logined`});
      return;
    }

    if (ref_payload.iss !== process.env.ISSUER || acc_payload.iss !== ref_payload.iss) {
      res.status(403).json({ success: false, message: 'Wrong application' });
      return;
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    console.log('Successfully logout - JWT');
    res.status(200).json({ success: true, message: 'Successfully logout' });
  } catch(err) {
    console.error('Failed to authenticate:', err);
    res.status(405).json({ success: false, message: 'Failed to logout' });
  }
};

export default logoutJWT;