import path from 'path';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const renderUserPage = (req: Request, res: Response) => {
  try {
    res.sendFile(path.join(process.env.PUBLIC as string, 'index.html'));
  } catch (err: unknown) {
    console.error('Error from rendering user page: ', err instanceof Error ? err.message : err);
  }
};

export default renderUserPage;
