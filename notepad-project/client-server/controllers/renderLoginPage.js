import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const renderLoginPage = (req, res) => {
  try {
    res.sendFile(path.join(process.env.PUBLIC, 'login.html'));
  } catch (err) {
    console.error('Error from rendering login page: ', err instanceof Error ? err.message : err);
  }
};
export default renderLoginPage;
