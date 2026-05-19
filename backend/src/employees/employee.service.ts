import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { HttpError } from "../error-handler";

export type SerializedEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  project: string;
  hourlyRate: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

type EmployeeRow = Prisma.EmployeeGetPayload<object>;

export function serializeEmployee(e: EmployeeRow): SerializedEmployee {
  return {
    id: e.id,
    firstName: e.firstName,
    lastName: e.lastName,
    position: e.position,
    project: e.project,
    hourlyRate: e.hourlyRate.toFixed(2),
    status: e.status,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  };
}

export type EmployeeData = {
  firstName: string;
  lastName: string;
  position: string;
  project: string;
  hourlyRate: string;
  status: "ACTIVE" | "INACTIVE";
};

export async function listEmployees(filters: { project?: string; status?: "ACTIVE" | "INACTIVE" }) {
  const rows = await prisma.employee.findMany({
    where: {
      ...(filters.project ? { project: filters.project } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(serializeEmployee);
}

export async function getEmployee(id: string) {
  const row = await prisma.employee.findUnique({ where: { id } });
  if (!row) throw new HttpError(404, "Employee not found");
  return serializeEmployee(row);
}

export async function createEmployee(input: EmployeeData) {
  const row = await prisma.employee.create({
    data: { ...input, hourlyRate: new Prisma.Decimal(input.hourlyRate) },
  });
  return serializeEmployee(row);
}

export async function updateEmployee(id: string, input: EmployeeData) {
  const row = await prisma.employee.update({
    where: { id },
    data: { ...input, hourlyRate: new Prisma.Decimal(input.hourlyRate) },
  });
  return serializeEmployee(row);
}

export async function deleteEmployee(id: string) {
  await prisma.employee.delete({ where: { id } });
}
