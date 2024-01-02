import fs from "fs/promises";
import getPath from "../common-functions/getPath.mjs";

const loginSess = (req, res) => {
  const { id, pw } = req.body;
  console.log('login info: ', [id, pw]);

  const separator = "controllers";
  const usersDir = 'users';
  const fileName = `${id}.json`;
  const userPath = getPath(import.meta.url, separator, [usersDir, fileName]);

  fs.readFile(userPath)
  .then((file) => {
    const user = JSON.parse(file);  

    if (pw !== user.pw) {  
      res.status(209).json({ success: false, message: 'Passwords do NOT match' });
      return;
    }

    req.session.userId = id;  // id로 하려고 했더니 에러 남
    req.session.is_logined = true; 

    res.status(200).json({ success: true, message: 'Successfully login' });
  })
  .catch((err) => {
    console.error('Failed to log in', err);
    res.status(204).json({ success: false, message: 'User not found' });
  });
};

export default loginSess;