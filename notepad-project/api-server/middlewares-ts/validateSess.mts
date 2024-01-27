import errorHandler from '../helpers/errorHandler.js'
import { type Request, type Response, type NextFunction } from 'express'
import type session from 'express-session'
import { type UserAttributes } from '../types'

declare module 'express' {
  interface Request {
    session: session.Session & { userData: UserAttributes }
  }
}

const validateSess = (
  req: Request,
  res: Response,
  next: NextFunction
): undefined => {
  const userId = req.params.userId
  const userData: UserAttributes = req.session.userData

  if (userData.userId !== userId) {
    errorHandler(401, `Unauthorized: user ${userId} does NOT match`, null, res)
    return
  }

  if (userData.is_logined === false) {
    errorHandler(
      401,
      `Unauthorized: ${userId} is not a logged in user`,
      null,
      res
    )
    return
  }

  next()
}

export default validateSess
