import { type Response } from 'express'

const errorHandler = (statusCode: number, errorMessage: string, err: unknown | null, res?: Response): void => {
  // err를 넣었더니 토큰 expired 될때 에러 메세지가 너무 많이 뜬다...
  console.error('errorHandler: ' + errorMessage)
  if (err !== null) {
    console.error('Error message from upper step - ', err)
  }

  if (res !== undefined) {
    res.status(statusCode).json({ success: false, message: err !== null ? err : 'failed' })
  }
}

export default errorHandler
