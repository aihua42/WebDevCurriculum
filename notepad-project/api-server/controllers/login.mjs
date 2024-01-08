import errorHandler from "../helpers/errorHandler.mjs";
import createToken from "../helpers/createToken.mjs";
import saveToken from "../helpers/saveToken.mjs";
import tokenOptions from "../helpers/tokenOptions.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";
import comparePW from "../helpers/comparePW.mjs";

const loginSess = async (req, res) => {
  const { userId, pw } = req.body;
  console.log('user id and pw logging in: ', req.body);

  try {
    const userDBdata = await loadDBdata(userId, 'User', res);

    if (Object.keys(userDBdata).length === 0) {
      return errorHandler(204, `${userId} not found in User DB`, null, res);
    }

    const checkPW = comparePW(pw, userDBdata.pw);
    if (!checkPW) {  
      return errorHandler(209, 'DB Passwords do NOT match within session', null, res);
    }

    req.session.userId = userId;
    req.session.is_logined = true;
    console.log('session: ', req.session);

    res.status(201).json({ success: true, message: 'Successfully login within session' });
  } catch (err) {
    errorHandler(204, `${userId} failed to log in within session`, err, res);
  }
};

const loginJWT = async (req, res) => {
  const { userId, pw } = req.body;
  console.log('user id and pw logging in: ', req.body);

  try {
    const userDBdata = await loadDBdata(userId, 'User', res);

    if (Object.keys(userDBdata).length === 0) {
      return errorHandler(204, `${userId} not found in User DB`, null, res);
    }

    const checkPW = comparePW(pw, userDBdata.pw);
    if (!checkPW) {  
      return errorHandler(209, 'DB Passwords do NOT match within session', null, res);
    }

    // refresh token, access token이 expired 됐을 때 access token 갱신 용도. 
    const refreshToken = {
      token: createToken(userId, 'refresh'),
      options: tokenOptions
    };
    
    await saveToken(userId, refreshToken.token, res);

    // access token. client에게 전송됨
    const accessToken = createToken(userId, 'access');
    
    res.cookie('accessToken', accessToken, tokenOptions);
    res.status(201).json({ success: true, message: 'Successfully login within JWT' });
  } catch (err) {
    errorHandler(204, `${userId} failed to log in within JWT`, err, res);
  }
};

//export default loginSess;
export default loginJWT;