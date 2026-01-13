import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  // * PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields!";
  }

  res.status(statusCode);
  // res.render("error from error handler ----", { error: err });
  res.json({
    success: false,
    message: errorMessage,
    error: err,
  });
};
