import path from 'path';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const renderSignupPage = (req: Request, res: Response) => {
  try {
    res.sendFile(path.join(process.env.PUBLIC as string, 'signup.html'));
  } catch (err: unknown) {
    console.error('Error from rendering sign up page: ', err instanceof Error ? err.message : err);
  }
};

export default renderSignupPage;
