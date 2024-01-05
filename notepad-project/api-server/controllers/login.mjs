import errorHandler from "../helpers/errorHandler.mjs";
import loadUserData from "../helpers/loadUserData.mjs";
import createToken from "../helpers/createToken.mjs";
import saveUserData from "../helpers/saveUserData.mjs";
import tokenOptions from "../helpers/tokenOptions.mjs";

const loginSess = async (req, res) => {
  const { id, pw } = req.body;
  console.log('user id and pw logging in: ', req.body);

  try {
    const userData = await loadUserData(id, "users", res);

    if (Object.keys(userData).length === 0) {
      return errorHandler(204, `${id} not found`, null, res);
    }

    if (pw !== userData.pw) {  
      return errorHandler(209, 'Passwords do NOT match within session', null, res);
    }

    req.session.userId = id;
    req.session.is_logined = true;

    res.status(201).json({ success: true, message: 'Successfully login within session' });
  } catch (err) {
    errorHandler(204, `${id} failed to log in within session`, err, res);
  }
};

const loginJWT = async (req, res) => {
  const { id, pw } = req.body;
  console.log('user id and pw logging in: ', req.body);

  try {
    const userData = await loadUserData(id, "users", res);

    if (Object.keys(userData).length === 0) {  
      return errorHandler(204, `${id} not found`, null, res);
    }

    if (pw !== userData.pw) {  
      return errorHandler(209, 'Passwords do NOT match within JWT', null, res);
    }

    // refresh token, access token이 expired 됐을 때 access token 갱신 용도. 
    const refreshToken = {
      token: createToken(id, 'refresh'),
      options: tokenOptions
    };
    
    await saveUserData(refreshToken, id, 'tokens', res);

    // access token. client에게 전송됨
    const accessToken = createToken(id, 'access');
    res.cookie('accessToken', accessToken, tokenOptions);
    res.status(201).json({ success: true, message: 'Successfully login within JWT' });
  } catch (err) {
    errorHandler(204, `${id} failed to log in within JWT`, err, res);
  }
};

export default loginSess;
//export default loginJWT;