import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const renderSignupPage = (req, res) => {
  try {
    res.sendFile(path.join(process.env.__PUBLIC_GQL, 'signup.html'));
  } catch(err) {
    console.error('Error from rendering sign up page: ', err.message);
  }
};

export default renderSignupPage;