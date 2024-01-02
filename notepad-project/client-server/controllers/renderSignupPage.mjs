import getPath from "../common-functions/getPath.mjs";

const renderSignupPage = (req, res) => {
  try {
    const separator = 'controllers';
    const pathsToAdd = ['views', 'signup.html'];
    const signupPath = getPath(import.meta.url, separator, pathsToAdd);
    res.sendFile(signupPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
}

export default renderSignupPage;