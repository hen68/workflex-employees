"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./api";
import type { Employee, EmployeeFiltersValue } from "./types";

export function useEmployees() {
  const [filters, setFilters] = useState<EmployeeFiltersValue>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  // `loading` covers the INITIAL load only. Filter-driven refetches keep the
  // previous rows on screen (stale-while-revalidate) so the list never blanks
  // or flickers — it swaps in place once the new data resolves.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  const fetchEmployees = useCallback(async (f: EmployeeFiltersValue) => {
    inFlight.current?.abort(); // single-flight: supersede any in-flight request
    const controller = new AbortController();
    inFlight.current = controller;
    setError(null);
    try {
      const data = await api.list(f, controller.signal);
      setEmployees(data);
    } catch (e) {
      if (controller.signal.aborted) return; // superseded by a newer query
      setError(e instanceof Error ? e.message : "Failed to load employees");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEmployees(filters);
    return () => inFlight.current?.abort();
  }, [filters, fetchEmployees]);

  const reload = useCallback(() => fetchEmployees(filters), [filters, fetchEmployees]);

  return { employees, loading, error, filters, setFilters, reload };
}
