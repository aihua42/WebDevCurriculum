import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs/promises';

// set the port
const app = express();
app.set('port', 8000);

// middlewares
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3000/'
}));
app.use(express.json());

// call textList from server directory or make an empty one
let textList = [];
async function loadTextList() {
  try {
    const fileContent = await fs.readFile('./text-list.json', 'utf-8'); 
    textList = JSON.parse(fileContent);
  } catch (err) {}
} 

// save in api server directory
async function save(textList) {
  try {
    await fs.writeFile('./text-list.json', JSON.stringify(textList, null, 2), 'utf-8');
  } catch (err) {
    console.error('Fail to save:', err.message);
  }
}

loadTextList();

function hasTitle(title) {
  return textList.some((ele) => title === ele.title);
}

// routers
// GET method - when client open the text
app.get('/text/:id', (req, res) => { 
  const id = req.params.id;  
  const findText = textList.find((ele) => ele.id === id); 
  if (findText) {
    res.status(200).send(findText.text);
  } else {
    res.status(204).json({ success: false, message: 'Text not found' });
  }
});

// POST method - when client save a new text
app.post('/text', (req, res) => {
  const { id, title, text } = req.body;
  
  if (hasTitle(title)) {
    res.status(409).json({ success: false, message: 'Title already exists' });
  } else { 
    const newText = { id, title, text };  
    textList.push(newText);  
    save(textList);
    
    res.status(201).json({ success: true, message: 'Successfully added' });
  }
});

// PATCH method - update title or text
app.patch('/text/:key', (req, res) => {
  const key = req.params.key;
  const { before, after } = req.body;

  if (key === 'title' && hasTitle(after)) {
    res.status(409).json({ success: false, message: 'Title already exists' });
    return;
  }

  let isUpdated = false;
  textList.forEach((obj) => {
    if (obj[key] === before) {
      isUpdated = true;
      obj[key] = after;
    }
  });

  if (isUpdated) {  
    save(textList);
    res.status(200).json({ success: true, message: 'Successfully updated' });
  } else {
    res.status(404).json({ success: false, message: 'Text not found' });
  }
})

// DELETE method - remove from server directory
app.delete('/text/:id', (req, res) => {
  const id = req.params.id;  
  const findText = textList.find((ele) => ele.id === id);
  const idx = textList.indexOf(findText);
  
  if (idx > -1) {
    textList.splice(idx, 1);
    save(textList);
    res.status(200).json({ success: true, message: 'Successfully deleted' });
  } else {
    res.status(404).json({ success: false, message: 'Text not found' });
  }
});

app.listen(app.get('port'));