import getPath from "../utility/getPath.mjs";

const renderLoginPage = (req, res) => {
  try { 
    const loginPath = getPath(import.meta.url, 'controllers', ['views', 'login.html']);
    res.sendFile(loginPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
};

export default renderLoginPage;