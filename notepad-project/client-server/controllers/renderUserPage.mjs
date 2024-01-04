import getPath from '../utility/getPath.mjs';
import verifyUser from '../utility/verifyUser.mjs';

const renderUserPage = (req, res) => {
  try {
    const check = verifyUser(req, res);
    if (check) {
      const indexPath = getPath(import.meta.url, 'controllers', ['views', 'index.html']);
      res.sendFile(indexPath);
    } else {
      console.error('Failed to verify the user');
      res.status(405).json({ success: false, message: 'Failed to verify the user' });
    }
  } catch(err) {
    console.error('Error: ', err.message);
    res.status(405).json({ success: false, message: 'Failed to authenticate the user' });
  }
};

export default renderUserPage;