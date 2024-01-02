import fs from "fs/promises";
import getPath from "../common-functions/getPath.mjs";

const logoutSess = async (req, res) => {
  if (!req.session.is_logined) {
    res.status(500).json({ success: false, message: `User ${userId} is not logined`});
    return;
  }

  const userId = req.session.userId;
  const data = req.body;

  const separator = "controllers";
  const usersDir = 'users';
  const fileName = `${userId}.json`;
  const userPath = getPath(import.meta.url, separator, [usersDir, fileName]);

  await fs.readFile(userPath)
  .then(async (file) => {
    const userData = JSON.parse(file);
    if (userData.id !== userId) {
      res.status(404).json({ success: false, message: 'User id does NOT match' });
      return;
    }

    userData.data = data;
    await fs.writeFile(userPath, JSON.stringify(userData, null, 2), 'utf-8')
    .then(() => {
      req.session.is_logined = false;
      
      req.session.destroy((err) => {
        if (err) {
          console.error('Failed to destroy session:', err);
          res.status(500).json({ success: false, message: 'Failed to logout' });
        } else {
          console.log('Successfully logout');
          res.status(200).json({ success: true, message: 'Successfully logout' });
        }
      });
    })
    .catch((err) => { 
      console.error(`Failed to add the data to user ${userId}`, err);
      res.status(500).json({ success: false, message: `Failed to add the data to user ${userId}`});
    });
  })
  .catch((err) => {
    res.status(404).json({ success: false, message: 'User file not found' });
  });
};

export default logoutSess;