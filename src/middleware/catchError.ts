import { Request, Response, NextFunction } from 'express';
const catchError = (callback: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch((error: Error) => {
      return res.json({ message: "catch error", error: error.message });
    });
  };
};

export default catchError;

  
  
  
  