import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const renderSignupPage = (req, res) => {
  try {
    res.sendFile(path.join(process.env.PUBLIC, 'signup.html'));
  } catch (err) {
    console.error('Error from rendering sign up page: ', err instanceof Error ? err.message : err);
  }
};
export default renderSignupPage;
