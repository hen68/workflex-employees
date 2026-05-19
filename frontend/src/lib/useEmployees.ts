"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import type { Employee, EmployeeFiltersValue } from "./types";

export function useEmployees() {
  const [filters, setFilters] = useState<EmployeeFiltersValue>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEmployees(await api.list(filters));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void load();
  }, [load]);

  return { employees, loading, error, filters, setFilters, reload: load };
}
