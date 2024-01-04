const tokenOptions = {
  secure: false,  // true: only transmit cookie over https
  httpOnly: true,  // prevents client side JS from reading the cookie
  expires: false // session cookie에 저장. will be deleted when the user closes their browser
}

export default tokenOptions;