"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { EmployeeForm } from "@/components/EmployeeForm";

export default function NewEmployeePage() {
  return (
    <>
      <h1>Add employee</h1>
      <p><Link href="/">← Back</Link></p>
      <EmployeeForm submitLabel="Create" onSubmit={(input) => api.create(input)} />
    </>
  );
}
