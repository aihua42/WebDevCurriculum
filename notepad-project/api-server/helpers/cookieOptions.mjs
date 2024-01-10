const cookieOptions = {
  secure: false, // true: only transmit cookie over https
  httpOnly: true, // prevents client side JS from reading the cookie
  expires: false, // session cookie. will be deleted when the users close their browsers
  //maxAge: 3600000, // Session expires after 1 hour
};

export default cookieOptions;
