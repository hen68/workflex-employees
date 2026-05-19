export type EmployeeStatus = "ACTIVE" | "INACTIVE";

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  project: string;
  hourlyRate: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeInput = {
  firstName: string;
  lastName: string;
  position: string;
  project: string;
  hourlyRate: string;
  status: EmployeeStatus;
};

export type EmployeeFiltersValue = { project?: string; status?: EmployeeStatus };

export type ProjectSummary = {
  project: string;
  employeeCount: number;
  standardMonthlyHours: number;
  totalCost: string; // string — never Number()-parsed (preserve Decimal precision)
};
