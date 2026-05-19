import { Router } from "express";
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type EmployeeData,
} from "./employee.service";

export const employeeRouter = Router();

employeeRouter.get("/", async (req, res) => {
  const project = typeof req.query.project === "string" ? req.query.project : undefined;
  const status =
    req.query.status === "ACTIVE" || req.query.status === "INACTIVE" ? req.query.status : undefined;
  res.json(await listEmployees({ project, status }));
});

employeeRouter.post("/", async (req, res) => {
  res.status(201).json(await createEmployee(req.body as EmployeeData));
});

employeeRouter.get("/:id", async (req, res) => {
  res.json(await getEmployee(req.params.id));
});

employeeRouter.put("/:id", async (req, res) => {
  res.json(await updateEmployee(req.params.id, req.body as EmployeeData));
});

employeeRouter.delete("/:id", async (req, res) => {
  await deleteEmployee(req.params.id);
  res.status(204).end();
});
