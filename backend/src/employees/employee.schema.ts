import { z } from "zod";

const trimmed = z.string().trim().min(1).max(100);

const hourlyRate = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "number" ? String(v) : v.trim()))
  .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), {
    message: "must be a positive number with at most 2 decimal places",
  })
  .refine(
    (v) => {
      const n = Number(v);
      return n > 0 && n <= 100000;
    },
    { message: "must be greater than 0 and at most 100000" },
  );

const baseEmployee = z.object({
  firstName: trimmed,
  lastName: trimmed,
  position: trimmed,
  project: trimmed,
  hourlyRate,
});

export const createEmployeeSchema = baseEmployee.extend({
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateEmployeeSchema = baseEmployee.extend({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const listQuerySchema = z.object({
  project: z.string().trim().min(1).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
