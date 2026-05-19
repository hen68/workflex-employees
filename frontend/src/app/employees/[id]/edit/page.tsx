"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EmployeeForm } from "@/components/EmployeeForm";
import type { EmployeeInput } from "@/lib/types";

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initial, setInitial] = useState<EmployeeInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(id)
      .then((e) =>
        setInitial({
          firstName: e.firstName,
          lastName: e.lastName,
          position: e.position,
          project: e.project,
          hourlyRate: e.hourlyRate,
          status: e.status,
        }),
      )
      .catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, [id]);

  return (
    <>
      <h1>Edit employee</h1>
      <p><Link href="/">← Back</Link></p>
      {error && <p className="error">{error}</p>}
      {!initial && !error && <p>Loading…</p>}
      {initial && (
        <EmployeeForm initial={initial} submitLabel="Save" onSubmit={(input) => api.update(id, input)} />
      )}
    </>
  );
}
