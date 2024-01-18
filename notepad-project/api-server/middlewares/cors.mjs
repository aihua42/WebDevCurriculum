import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const corsMiddleware = cors({
  credentials: true,
  origin: 'https://localhost:' + process.env.PORT_CORS_GRAPHQL,  // does NOT work...
});

export default corsMiddleware;