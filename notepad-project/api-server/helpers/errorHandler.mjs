const errorHandler = (statusCode, ErrorMessage, err, res) => {
  // err를 넣었더니 토큰 expired 될때 에러 메세지가 너무 많이 뜬다... 그냥 에러 뜨면 구체적으로 터미널에 찍어보자...
  console.error('Error Handler: ' + ErrorMessage + ';');

  return res.status(statusCode).json({ success: false, message: ErrorMessage });
}

export default errorHandler;