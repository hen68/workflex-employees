"use client";
import { useState } from "react";
import type { EmployeeFiltersValue, EmployeeStatus } from "@/lib/types";

export function EmployeeFilters({
  value,
  onChange,
}: {
  value: EmployeeFiltersValue;
  onChange: (v: EmployeeFiltersValue) => void;
}) {
  const [project, setProject] = useState(value.project ?? "");

  function applyProject() {
    const next = project.trim() || undefined;
    if (next !== value.project) onChange({ ...value, project: next });
  }

  return (
    <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault();
        applyProject();
      }}
    >
      <div>
        <label htmlFor="f-project">Filter by project</label>
        <input
          id="f-project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          onBlur={applyProject}
        />
      </div>
      <div>
        <label htmlFor="f-status">Filter by status</label>
        <select
          id="f-status"
          value={value.status ?? ""}
          onChange={(e) =>
            onChange({ ...value, status: (e.target.value || undefined) as EmployeeStatus | undefined })
          }
        >
          <option value="">All</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
      <button type="submit">Apply</button>
    </form>
  );
}
