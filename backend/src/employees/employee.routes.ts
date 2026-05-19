import { Router } from "express";
import { env } from "../env";
import { HttpError } from "../error-handler";
import { validateBody, validateQuery } from "../validate";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  listQuerySchema,
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
} from "./employee.schema";
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  summarizeProject,
} from "./employee.service";

export const employeeRouter = Router();

employeeRouter.get("/", validateQuery(listQuerySchema), async (_req, res) => {
  res.json(await listEmployees(res.locals.query));
});

employeeRouter.get("/summary", async (req, res) => {
  const project = String(req.query.project ?? "").trim();
  if (!project) throw new HttpError(400, "Query parameter 'project' is required");
  res.json(await summarizeProject(project, env.STANDARD_MONTHLY_HOURS));
});

employeeRouter.post("/", validateBody(createEmployeeSchema), async (_req, res) => {
  res.status(201).json(await createEmployee(res.locals.body as CreateEmployeeInput));
});

employeeRouter.get("/:id", async (req, res) => {
  res.json(await getEmployee(req.params.id));
});

employeeRouter.put("/:id", validateBody(updateEmployeeSchema), async (req, res) => {
  res.json(await updateEmployee(String(req.params.id), res.locals.body as UpdateEmployeeInput));
});

employeeRouter.delete("/:id", async (req, res) => {
  await deleteEmployee(req.params.id);
  res.status(204).end();
});
