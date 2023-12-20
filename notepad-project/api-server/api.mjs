import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs/promises';

// set the port
const app = express();
app.set('port', 8000);

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// handle preflight request
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).json({});
  }
  next(); 
});

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
app.get('/texts/:id', (req, res) => { 
  const id = req.params.id;  
  const findText = textList.find((ele) => ele.title === id); 
  if (findText) {
    res.status(200).send(findText.text);
  } else {
    res.status(404).json({ success: false, message: 'Text not found' });
  }
});

// POST method - when client save a new text
app.post('/texts', (req, res) => {
  const { title, text } = req.body;
  
  if (hasTitle(title)) {
    res.status(409).json({ success: false, message: 'Title already exists' });
  } else { 
    const newText = { title, text };  
    textList.push(newText);  
    save(textList);
    
    res.status(201).json({ success: true, message: 'Successfully added' });
  }
});

// update title or text
app.patch('/texts/:id', (req, res) => {
  const id = req.params.id; // previous value
  const body = req.body;  
  const key = Object.keys(body)[0];

  if (key === 'title' && hasTitle(body[key])) {
    res.status(409).json({ success: false, message: 'Title already exists' });
    return;
  }

  let isChanged = false;
  textList.forEach((obj, idx) => {
    if (obj[key] === id) {
      isChanged = true;
      obj[key] = body[key];
    }
  });

  if (isChanged) {  
    save(textList);
    res.status(200).json({ success: true, message: 'Successfully updated' });
  } else {
    res.status(404).json({ success: false, message: 'Text not found' });
  }
})

// remove from server directory
app.delete('/texts/:id', (req, res) => {
  const id = req.params.id;  
  const findText = textList.find((ele) => ele.title === id);
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