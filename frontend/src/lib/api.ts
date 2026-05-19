import type { Employee, EmployeeInput, EmployeeFiltersValue, ProjectSummary } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (res.status === 204) return undefined as T;
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = json?.error ?? { message: "Request failed" };
    throw new ApiError(res.status, err.message, err.fieldErrors);
  }
  return json as T;
}

export const api = {
  list: (f: EmployeeFiltersValue) => {
    const q = new URLSearchParams();
    if (f.project) q.set("project", f.project);
    if (f.status) q.set("status", f.status);
    const qs = q.toString();
    return request<Employee[]>(`/employees${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => request<Employee>(`/employees/${id}`),
  create: (body: EmployeeInput) =>
    request<Employee>("/employees", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: EmployeeInput) =>
    request<Employee>(`/employees/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) => request<void>(`/employees/${id}`, { method: "DELETE" }),
  summary: (project: string) =>
    request<ProjectSummary>(`/employees/summary?project=${encodeURIComponent(project)}`),
};
