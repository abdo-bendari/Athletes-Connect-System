import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/Error';

const globalError = (err: AppError, req: Request, res: Response, next: NextFunction) => {
   
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
};

export default globalError;




  