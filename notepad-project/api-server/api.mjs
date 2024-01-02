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

// call textList from server directory or make an empty one
let textList = [];
async function loadTextList(userId) {
  const textsDir = 'texts';
  const textPath = path.join(textsDir, `${userId}.json`);  
  await fs.readFile(textPath, 'utf-8')
  .then((file) => { 
    textList = JSON.parse(file);
  })
  .catch(async (err) => {
    await fs.mkdir(textsDir, { recursive: true })
    .then()
    .catch((err) => {
      console.error('Failed to make directory for texts folder', err);
      res.status(500).json({ success: false, message: 'Failed to make directory for texts folder' });
    });
  });
} 

// save in api server directory
async function save(textList, userId) {
  try {
    const textsDir = 'texts';
    const textPath = path.join(textsDir, `${userId}.json`);  
    await fs.writeFile(textPath, JSON.stringify(textList, null, 2), 'utf-8')
  } catch (err) {
    console.error('Fail to save:', err.message);
  }
}

function hasTitle(title, textList) {
  return textList.some((ele) => title === ele.title);
}

// GET method - when client open the text
app.get('/user/:userId/:id', async (req, res) => {
  const id = req.params.id; 
  const userId = req.params.userId;
  await loadTextList(userId); 
  console.log('userId and text id: ', [userId, id]);
  console.log('text list of GET: ', textList);

  const findText = textList.find((ele) => ele.id === id); 
  if (findText) { 
    res.status(200).json(findText);
  } else {
    res.status(204).json({ success: false, message: 'Text not found' });
  }
});

// POST method - when client save a new text
app.post('/:userId', async (req, res) => {
  const userId = req.params.userId;
  await loadTextList(userId);  
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

// PATCH method - update title or text
app.patch('/user/:userId/:key', async (req, res) => {
  const userId = req.params.userId;
  await loadTextList(userId);
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
  await loadTextList(userId);
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