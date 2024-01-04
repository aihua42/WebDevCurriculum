import getPath from "../utility/getPath.mjs";

const renderSignupPage = (req, res) => {
  try {
    const signupPath = getPath(import.meta.url, 'controllers', ['views', 'signup.html']);
    res.sendFile(signupPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
}

export default renderSignupPage;