import errorHandler from "../../originals/helpers/errorHandler.mjs";
const validateSess = (req, res, next) => {
  const userId = req.params.userId;
  const userData = req.session.userData;
  if (userData.userId !== userId) {
    errorHandler(401, `Unauthorized: user ${userId} does NOT match`, null, res);
    return;
  }
  if (userData.is_logined === false) {
    errorHandler(
      401,
      `Unauthorized: ${userId} is not a logged in user`,
      null,
      res
    );
    return;
  }
  next();
};
export default validateSess;
