"use client";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { useEmployees } from "@/lib/useEmployees";
import { EmployeeFilters } from "@/components/EmployeeFilters";
import { EmployeeTable } from "@/components/EmployeeTable";
import { ProjectCostPanel } from "@/components/ProjectCostPanel";

export default function HomePage() {
  const { employees, loading, error, filters, setFilters, reload } = useEmployees();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function onDelete(id: string) {
    if (!window.confirm("Delete this employee?")) return;
    setDeleteError(null);
    try {
      await api.remove(id);
      await reload();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <>
      <h1>WORKFLEX Employees</h1>
      <p><Link href="/employees/new">+ Add employee</Link></p>
      <EmployeeFilters value={filters} onChange={setFilters} />
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {deleteError && <p className="error">{deleteError}</p>}
      {!loading && !error && <EmployeeTable employees={employees} onDelete={onDelete} />}
      <ProjectCostPanel />
    </>
  );
}
