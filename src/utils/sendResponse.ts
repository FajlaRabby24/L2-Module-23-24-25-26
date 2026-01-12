import { Response } from "express";

export const sendResponse = (
  res: Response,
  stautsCode: number,
  success: boolean,
  message?: string,
  data?: any
) => {
  return res.status(stautsCode).json({
    success,
    message,
    data,
  });
};
