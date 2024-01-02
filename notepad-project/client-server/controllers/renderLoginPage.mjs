import getPath from "../common-functions/getPath.mjs";

const renderLoginPage = (req, res) => {
  try { 
    const separator = 'controllers';
    const pathsToAdd = ['views', 'login.html'];
    const loginPath = getPath(import.meta.url, separator, pathsToAdd);
    res.sendFile(loginPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
};

export default renderLoginPage;