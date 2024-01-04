import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs/promises';

// set the port
const app = express();
app.set('port', 8000);

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// call file from server directory or make an empty one
// output Array of textList, or Object of tabs
let textList = [];
let tabs = {};
async function loadUserData(userId, dirName = 'texts') {
  if (!userId) {
    console.error('userId is required');
    res.status(400).json({ success: false, message: 'userId is required' });
    return;
  }

  const pathStr = path.join(dirName, `${userId}.json`);  

  await fs.readFile(pathStr, 'utf-8')
  .then((file) => { 
    const data = JSON.parse(file);
    dirName === 'texts' ? textList = data : tabs = data;
  })
  .catch(async (err) => {
    await fs.mkdir(dirName, { recursive: true })
    .then()
    .catch((err) => {
      console.error(`Failed to make directory for ${dirName} folder`, err);
      res.status(500).json({ success: false, message: `Failed to make directory for ${dirName} folder` });
    });
  });
} 

// save in api server directory
async function save(data, userId, dirName = 'texts') {
  try {
    const pathStr = path.join(dirName, `${userId}.json`);  
    await fs.writeFile(pathStr, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Fail to save:', err.message);
  }
}

function hasTitle(title, textList) {
  return textList.some((ele) => title === ele.title);
}

// GET method - send the saved text
app.get('/user/:userId/:id', async (req, res) => {
  const id = req.params.id; 
  const userId = req.params.userId;
  await loadUserData(userId);  // get textList
  console.log('userId and text id: ', [userId, id]);
  console.log('text list of GET: ', textList);

  const findText = textList.find((ele) => ele.id === id); 
  if (findText) { 
    res.status(200).json(findText);
  } else {
    res.status(204).json({ success: false, message: 'Text not found' });
  }
});

// GET method - send previous tabs
app.get('/tabs/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (userId !== req.params.userId) {
    res.status(404).json({ success: false, message: 'User id does NOT match' });
    return;
  }

  await loadUserData(userId, 'tabs');

  const dataStr = JSON.stringify(tabs);
  const contentLen = Buffer.from(dataStr).length;
  console.log("content length: ", contentLen);

  res.setHeader("Content-Length", contentLen); // net::ERR_CONNECTION_REFUSED
  res.send(tabs);
});

// POST method - when client save a new text
app.post('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  await loadUserData(userId);   // get textList

  const { id, title, text } = req.body;
  console.log('text list of before POST: ', textList);
  
  if (hasTitle(title, textList)) { 
    res.status(409).json({ success: false, message: 'Title already exists' });
  } else { 
    const newText = { id, title, text };  
    textList.push(newText);  

    await save(textList, userId);
    console.log('text list of after POST: ', textList);
    
    res.status(201).json({ success: true, message: 'Successfully added' });
  }
});

// POST method - when client sends previous tabs
app.post('/tabs/:userId', async (req, res) => {
  const { userId, activeTitle, texts } = req.body;  // userId, activeTitle, texts(Array)
  if (userId !== req.params.userId) {
    res.status(404).json({ success: false, message: 'User id does NOT match' });
    return;
  }

  await loadUserData(userId, 'tabs');  // get tabs
  tabs = { activeTitle, texts };

  await save(tabs, userId, 'tabs');
  console.log('Tabs successfully saved: ', tabs);

  res.status(201).json({ success: true, message: 'Tabs successfully saved' });
});

// PATCH method - update title or text
app.patch('/user/:userId/:key', async (req, res) => {
  const userId = req.params.userId;
  await loadUserData(userId);  // get textList
  console.log('text list of before PATCH: ', textList);

  const key = req.params.key;
  const { id, before, after } = req.body;
 
  if (key === 'title' && hasTitle(after, textList)) {
    res.status(409).json({ success: false, message: 'Title already exists' });
    return;
  }

  let isUpdated = false;
  textList.forEach((obj) => {
    if (key === 'title' && obj.title === before) {
      isUpdated = true;
      obj.id = id;
      obj.title = after;
    } else if (key === 'text' && obj.id === id) {
      isUpdated = true;
      obj.text = after;
    }
  });

  if (isUpdated) {  
    await save(textList, userId);
    console.log('text list of after PATCH: ', textList);

    res.status(200).json({ success: true, message: 'Successfully updated' });
  } else {  
    res.status(404).json({ success: false, message: 'Text not found' });
  }
})

// DELETE method - remove from server directory
app.delete('/user/:userId/:id', async (req, res) => {
  const userId = req.params.userId;
  await loadUserData(userId);
  console.log('text list of before DELETE: ', textList);

  const id = req.params.id;  
  const findText = textList.find((ele) => ele.id === id);
  const idx = textList.indexOf(findText);
  
  if (idx > -1) {
    textList.splice(idx, 1);
    await save(textList, userId);
    console.log('text list of after DELETE: ', textList);

    res.status(200).json({ success: true, message: 'Successfully deleted' });
  } else {
    res.status(204).json({ success: false, message: 'Text not found' });
  }
});

app.listen(app.get('port'), () => {
  console.log(`API server has started and is listening on port number: ${app.get('port')}`);
});