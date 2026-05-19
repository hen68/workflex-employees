"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api";
import type { EmployeeInput } from "@/lib/types";

const EMPTY: EmployeeInput = {
  firstName: "",
  lastName: "",
  position: "",
  project: "",
  hourlyRate: "",
  status: "ACTIVE",
};

export function EmployeeForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: EmployeeInput;
  submitLabel: string;
  onSubmit: (input: EmployeeInput) => Promise<unknown>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<EmployeeInput>(initial ?? EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof EmployeeInput>(k: K, v: EmployeeInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    try {
      await onSubmit(form);
      // Client-only app: navigating back remounts the list page, whose
      // useEmployees hook refetches on mount. No router.refresh() (it is a
      // no-op without Server Components and would contradict the architecture).
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.fieldErrors ?? {});
      } else {
        setError("Something went wrong");
      }
    }
  }

  const fields: { key: keyof EmployeeInput; label: string }[] = [
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "position", label: "Position" },
    { key: "project", label: "Project" },
    { key: "hourlyRate", label: "Hourly rate" },
  ];

  return (
    <form onSubmit={submit}>
      {fields.map(({ key, label }) => (
        <div key={key}>
          <label htmlFor={key}>{label}</label>
          <input
            id={key}
            required
            aria-describedby={fieldErrors[key] ? `${key}-err` : undefined}
            value={form[key]}
            onChange={(e) => set(key, e.target.value)}
          />
          {fieldErrors[key] && (
            <p id={`${key}-err`} className="field-error">{fieldErrors[key].join(", ")}</p>
          )}
        </div>
      ))}
      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={form.status}
          onChange={(e) => set("status", e.target.value as EmployeeInput["status"])}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      <p>
        <button type="submit">{submitLabel}</button>
      </p>
    </form>
  );
}
