"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { useEmployees } from "@/lib/useEmployees";
import { EmployeeFilters } from "@/components/EmployeeFilters";
import { EmployeeTable } from "@/components/EmployeeTable";
import { ProjectCostPanel } from "@/components/ProjectCostPanel";

export default function HomePage() {
  const { employees, loading, error, filters, setFilters, reload } = useEmployees();

  async function onDelete(id: string) {
    if (!window.confirm("Delete this employee?")) return;
    await api.remove(id);
    await reload();
  }

  return (
    <>
      <h1>WORKFLEX Employees</h1>
      <p><Link href="/employees/new">+ Add employee</Link></p>
      <EmployeeFilters value={filters} onChange={setFilters} />
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <EmployeeTable employees={employees} onDelete={onDelete} />}
      <ProjectCostPanel />
    </>
  );
}
