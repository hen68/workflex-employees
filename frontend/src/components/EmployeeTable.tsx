"use client";
import Link from "next/link";
import type { Employee } from "@/lib/types";

export function EmployeeTable({
  employees,
  onDelete,
}: {
  employees: Employee[];
  onDelete: (id: string) => void;
}) {
  if (employees.length === 0) return <p>No employees match the current filters.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Position</th>
          <th scope="col">Project</th>
          <th scope="col">Rate</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((e) => (
          <tr key={e.id}>
            <td>{e.firstName} {e.lastName}</td>
            <td>{e.position}</td>
            <td>{e.project}</td>
            <td>{e.hourlyRate}</td>
            <td>{e.status}</td>
            <td>
              <Link href={`/employees/${e.id}/edit`}>Edit</Link>{" "}
              <button type="button" onClick={() => onDelete(e.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
