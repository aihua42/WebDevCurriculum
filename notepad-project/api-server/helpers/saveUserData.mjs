import fs from 'fs/promises';
import path from 'path';

import errorHandler from './errorHandler.mjs';

const saveUserData = async (data, userId, dirName, res) => {
  try {
    const filePath = path.join(dirName, `${userId}.json`);  

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    errorHandler(500, `Fail to save the ${dirName}`, err.message, err, res);
  }
}

export default saveUserData;