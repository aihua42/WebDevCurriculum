import errorHandler from "../helpers/errorHandler.mjs";

const validateSess = async (req, res, next) => {
  const userId = req.params.userId;

  if (!userId) {
    errorHandler(409, 'User ID is missing in "validateSess" middleware', null, res);
    return;
  }

  const userData = await req.session.userData;

  if (userData.userId !== userId) {
    return errorHandler(
      401,
      `Unauthorized: user ${userId} does NOT match`,
      null,
      res
    );
  }

  if (!userData.is_logined) {
    return errorHandler(
      401,
      `Unauthorized: ${userId} is not a logged in user`,
      null,
      res
    );
  }

  next();
};

export default validateSess;