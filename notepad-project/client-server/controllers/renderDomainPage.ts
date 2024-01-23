import { Request, Response } from 'express';

const renderDomainPage = (req: Request, res: Response): void => {
  try {
    res.sendFile('index.html');
  } catch (err: unknown) {
    console.error('Error from rendering domain page: ', err instanceof Error ? err.message : err);
  }
};

export default renderDomainPage;
