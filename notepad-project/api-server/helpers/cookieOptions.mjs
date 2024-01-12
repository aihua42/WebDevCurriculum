const cookieOptions = {
  secure: false, // true: only transmit cookie over https
  httpOnly: true, // prevents client side JS from reading the cookie
  expires: false, // will be deleted when the users close their browsers
};

export default cookieOptions;
