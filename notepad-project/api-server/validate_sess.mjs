import throwError from "./throwError.mjs";

const validate_sess = async (req, res) => {
  const userData = await req.session.userData;
  console.log('user data to validate: ', userData);

  const userId = userData.userId;

  if (userId !== req.body.variables.userId) {
    throwError(401, 'Unauthorized_USER', 'Unauthorized: user ID does NOT match', res);
  }

  if (!userData.is_logined) {
    throwError(401, 'Unauthorized_USER', `Unauthorized: user ${userId} is log outed already`, res);
  }
};

export default validate_sess;