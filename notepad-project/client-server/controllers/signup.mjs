import fs from "fs/promises";
import getPath from "../common-functions/getPath.mjs";

const signup = async (req, res) => {
  const {id, nickname, pw} = req.body;
  const usersDir = 'users';

  await fs.mkdir(usersDir, { recursive: true })
  .then()
  .catch((err) => {
    console.error('Failed to make directory for users folder', err);
    res.status(500).json({ success: false, message: 'Failed to make directory for users folder' });
  });

  const separator = "controllers";
  const pathsToAdd = [usersDir, `${id}.json`];
  const userPath = getPath(import.meta.url, separator, pathsToAdd);

  try {
    await fs.access(userPath);
    res.status(209).json({ success: false, message: 'User already exists' });
  } catch(err) {
    const userData = { id, nickname, pw };

    fs.writeFile(userPath, JSON.stringify(userData, null, 2), 'utf-8')
    .then(() => {
      res.status(201).json({ success: true, message: 'Successfully sign up' });
    })
    .catch((err) => { 
      console.error(`Failed to create the user ${id}`, err);
      res.status(500).json({ success: false, message: 'Failed to create the user' });
    });
  }
};

export default signup;