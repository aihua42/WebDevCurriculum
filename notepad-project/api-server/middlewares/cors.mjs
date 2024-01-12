import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const corsMiddleware = cors({
  credentials: true,
  origin: 'http://localhost:' + process.env.PORT_CORS
});

export default corsMiddleware;