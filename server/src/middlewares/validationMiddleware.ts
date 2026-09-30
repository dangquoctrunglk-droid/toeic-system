import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, ZodType } from "zod";

/**
 * Middleware tổng quát xác thực dữ liệu request bằng Zod Schema
 * @param schema Zod Schema tương ứng với dữ liệu đầu vào
 */
export const validateData = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorList = error.issues || (error as any).error || [];
        const formattedErrors = errorList.map((issue: any) => ({
          field: issue.path.join(".") || "body",
          message: issue.message,
        }));
        res.status(StatusCodes.BAD_REQUEST).json({
          message: formattedErrors[0]?.message || "Dữ liệu không hợp lệ!",
          errors: formattedErrors,
        });
        return;
      }
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi hệ thống khi xác thực dữ liệu",
    });
  };
};
