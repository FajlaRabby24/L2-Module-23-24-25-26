import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500);
  // res.render("error from error handler ----", { error: err });
  res.json({
    success: false,
    message: "error from error handler ----",
    error: err,
  });
};
