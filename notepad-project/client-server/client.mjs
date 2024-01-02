import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import morgan from 'morgan';
import fs from 'fs/promises';
import session from 'express-session';  
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
import sessionFileStore from 'session-file-store';

//import { getRouter } from './routes/get.mjs';

// set the port
const app = express();
app.set('port', 3000);

// sesson options
const secretNum = uuidv5('users', '6ba7b810-9dad-11d1-80b4-00c04fd430c8');
const FileStore = sessionFileStore(session);

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(session(
  {
    store: new FileStore({ retries: 0 }), // 메모리 아닌 파일에 저장. options 넣음, unless [session-file-store] will retry, error on last attempt: Error: ENOENT, open 'json 파일'
    secret: secretNum,  // used to sign the session ID cookie
    genid: (req) => uuidv4(),  // generating session IDs, user 마다 세션 ID 만들어 주기 위해서. 세션 아이디는 브라우저 단위로 저장되고 브라우저 종료시 소멸된다.
    saveUninitialized: false,  // true: uninitialized상태(새로 생성된 session에 아무런 작업이 이루어지지 않은 상황)의 session을 강제로 저장
    resave: false,  // 새로운 요청 시 세션에 변동 사항이 없으면 저장 안함
    cookie: {
      secure: false,  // true: only transmit cookie over https
      httpOnly: true,  // prevents client side JS from reading the cookie
      expires: false, // Set to false to create a session cookie
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    }
  }
));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicFolderPath = path.join(__dirname, 'public');
app.use(express.static(publicFolderPath));

//app.use(getRouter);


app.get('/', (req, res) => {
  try {
    const indexPath = path.join(__dirname, 'views', 'index.html'); 
    res.sendFile(indexPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
});

app.get('/signup', (req, res) => {
  try {
    const signinPath = path.join(__dirname, 'views', 'signup.html'); 
    res.sendFile(signinPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
});

app.get('/login', (req, res) => {
  try { 
    const loginPath = path.join(__dirname, 'views', 'login.html'); 
    res.sendFile(loginPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
});

app.get('/user/:id', (req, res) => { 
  try { 
    if (!req.session.is_logined) {
      res.redirect('/login'); // Redirect to the login page if not log in
      return;
    }

    const userId = req.session.userId;
    const id = req.params.id;   

    if (id !== userId) {
      console.log('id and userId do NOT match: ', [id, userId]);

      res.status(409).json({ success: false, message: 'User id does NOT match' });
      return;
    }

    const indexPath = path.join(__dirname, 'views', 'index.html');
    res.sendFile(indexPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
});

app.get('/tabs/:id', (req, res) => {
  if (!req.session.is_logined) {
    res.redirect('/login'); // Redirect to the login page if not logged in
    return;
  }

  const userId = req.session.userId;
  const id = req.params.id;   

  if (id !== userId) {
    console.log('id and userId do not match: ', [id, userId]);

    res.status(409).json({ success: false, message: 'User id does NOT match' });
    return;
  }

  const usersDir = 'users';
  const userPath = path.join(usersDir, `${userId}.json`);  

  fs.readFile(userPath)
  .then(async (file) => {
    const userData = JSON.parse(file);
    const data = userData.data;

    if (data) {
      const dataStr = JSON.stringify(data);
      const contentLen = Buffer.from(dataStr).length;
      console.log('content length: ', contentLen);

      res.setHeader('Content-Length', contentLen);  // net::ERR_CONNECTION_REFUSED
      res.send(data);
    } else {
      console.log(`${id} is new!`);
      const indexPath = path.join(__dirname, 'views', 'index.html');
      res.sendFile(indexPath);
    }
  })
  .catch((err) => {
    res.status(404).json({ success: false, message: 'User file not found' });
  });
});


// POST method - log in
app.post('/login', (req, res) => {
  const { id, pw } = req.body;
  const usersDir = 'users';
  const userPath = path.join(usersDir, `${id}.json`);  
  console.log('login info: ', [id, pw]);

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
});

// POST method - log out
app.post('/logout', async (req, res) => {
  if (!req.session.is_logined) {
    res.status(500).json({ success: false, message: `User ${userId} is not logined`});
    return;
  }

  const userId = req.session.userId;
  const data = req.body;

  const usersDir = 'users';
  const userPath = path.join(usersDir, `${userId}.json`);  

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
});

// POST method - create a new user
app.post('/signup', async (req, res) => {
  const {id, nickname, pw} = req.body;
  const usersDir = 'users'; 

  await fs.mkdir(usersDir, { recursive: true })
  .then()
  .catch((err) => {
    console.error('Failed to make directory for users folder', err);
    res.status(500).json({ success: false, message: 'Failed to make directory for users folder' });
  });

  const userPath = path.join(usersDir, `${id}.json`);  

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
});

app.listen(app.get('port'), () => {
  console.log(`Client server has started and is listening on port number: ${app.get('port')}`);
});