import path from 'path';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const renderLoginPage = (req: Request, res: Response) => {
  try {
    res.sendFile(path.join(process.env.PUBLIC as string, 'login.html'));
  } catch (err: unknown) {
    console.error('Error from rendering login page: ', err instanceof Error ? err.message : err);
  }
};

export default renderLoginPage;
