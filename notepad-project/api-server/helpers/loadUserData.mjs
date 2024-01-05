import fs from 'fs/promises';
import path from 'path';

import errorHandler from './errorHandler.mjs';

// call file from server directory or make an empty one
// output Array for textList, or Object for tabs
const loadUserData = async (userId, dirName, res) => {
  if (!userId) {
    errorHandler(400, 'User ID is missing in loadUserData function', null, res);
    return;
  }

  let data = undefined;

  const pathStr = path.join(dirName, `${userId}.json`);  

  await fs.readFile(pathStr, 'utf-8')
  .then((file) => { 
    data = JSON.parse(file);  
  })
  .catch(async () => { 
    await fs.mkdir(dirName, { recursive: true })
    .then(() => {
      data = dirName === 'texts' ? [] : {};
    })
    .catch((err) => {
      errorHandler(500, `Failed to make directory for ${dirName} folder`, err, res);
    });
  });

  return data;
} 

export default loadUserData;