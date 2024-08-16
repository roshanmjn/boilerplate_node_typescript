import {Request,Response,NextFunction} from "express";   

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (fn:AsyncHandler) => (req:Request,res:Response,next:NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;
