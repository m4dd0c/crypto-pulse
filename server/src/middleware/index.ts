import { NextFunction, Request, Response } from "express";

export default function (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
}
