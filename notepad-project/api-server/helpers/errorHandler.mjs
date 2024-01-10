const errorHandler = (statusCode, ErrorMessage, err, res) => {
  // err를 넣었더니 토큰 expired 될때 에러 메세지가 너무 많이 뜬다... 
  console.error('errorHandler: ' + ErrorMessage);
  if (err) {
    console.error('Error message from upper step - ' + err);
  }

  if (res) {
    res.status(statusCode).json({ success: false, message: err ? err.message : 'failed' });
  } 
}

export default errorHandler;