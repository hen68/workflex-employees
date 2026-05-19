import { Router } from "express";
import { env } from "../env";
import { HttpError } from "../error-handler";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  listQuerySchema,
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

employeeRouter.get("/", async (req, res) => {
  const query = listQuerySchema.parse(req.query);
  res.json(await listEmployees(query));
});

employeeRouter.get("/summary", async (req, res) => {
  const project = String(req.query.project ?? "").trim();
  if (!project) throw new HttpError(400, "Query parameter 'project' is required");
  res.json(await summarizeProject(project, env.STANDARD_MONTHLY_HOURS));
});

employeeRouter.post("/", async (req, res) => {
  const body = createEmployeeSchema.parse(req.body);
  res.status(201).json(await createEmployee(body));
});

employeeRouter.get("/:id", async (req, res) => {
  res.json(await getEmployee(req.params.id));
});

employeeRouter.put("/:id", async (req, res) => {
  const body = updateEmployeeSchema.parse(req.body);
  res.json(await updateEmployee(req.params.id, body));
});

employeeRouter.delete("/:id", async (req, res) => {
  await deleteEmployee(req.params.id);
  res.status(204).end();
});
