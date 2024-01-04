const logoutSess = async (req, res) => {
  const userId = req.session.userId;
  if (req.body.id !== userId) {
    res.status(409).json({ success: false, message: 'User id does NOT match' });
    return;
  }

  if (!req.session.is_logined) {
    res.status(500).json({ success: false, message: `User ${userId} is not logined`});
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy the session:', err);
      res.status(500).json({ success: false, message: 'Failed to logout' });
    } else {
      console.log('Successfully logout - session');
      res.clearCookie('connect.sid');
      res.status(201).json({ success: true, message: 'Successfully logout' });
    }
  });
};

export default logoutSess;