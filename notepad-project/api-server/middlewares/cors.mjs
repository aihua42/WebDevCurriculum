import cors from 'cors';

const corsMiddleware = cors({
  credentials: true,
  origin: 'http://localhost:3000'
});

export default corsMiddleware;