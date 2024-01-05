import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const renderUserPage = (req, res) => {
  try {
    res.sendFile(path.join(process.env.__PUBLIC, 'index.html'));
  } catch(err) {
    console.error('Error from rendering user page: ', err.message);
  }
};

export default renderUserPage;