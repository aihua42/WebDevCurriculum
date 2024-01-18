import { ApolloError } from 'apollo-server-express';

const throwError = (statusCode, errorCode, errorMessage, res) => {
  console.error("--- throwError ---");
  console.error(errorMessage);

  if (res) {
    res.status(statusCode).json({ success: false, message: errorCode });
  } else {
    throw new ApolloError(errorMessage, errorCode, {
      statusCode
    });
  }
}

export default throwError;