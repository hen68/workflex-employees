import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

export const validateBody =
  (schema: ZodTypeAny): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return next(result.error);
    res.locals.body = result.data;
    next();
  };

export const validateQuery =
  (schema: ZodTypeAny): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) return next(result.error);
    res.locals.query = result.data;
    next();
  };
