import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const renderLoginPage = (req, res) => {
  try { 
    res.sendFile(path.join(process.env.__PUBLIC, 'login.html'));
  } catch(err) {
    
    console.error('Error from rendering login page: ', err.message);
  }
};

export default renderLoginPage;