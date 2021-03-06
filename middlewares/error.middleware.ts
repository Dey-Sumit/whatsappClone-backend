import { NextFunction, Request, Response } from "express";

// any error thrown by the process *eg throw new Error("blah") will not go to the function as it has 3 params instead it will go to the errorHandler (4 params) function
//https://expressjs.com/en/guide/error-handling.html
export function notFound(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`NOT Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// This error handling middleware has 4 parameters , error is the first one
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction //  because next is not used,don't omit that, else it will not work:) I spend my entire day to debug this
) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);
  console.error(err.message);
  console.log("--------------");

  console.error(process.env.NODE_ENV === "production" ? "🍰" : err.stack);
  res.json({
    message: err.message,
  });
}
