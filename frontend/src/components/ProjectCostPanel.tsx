"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { ProjectSummary } from "@/lib/types";

export function ProjectCostPanel() {
  const [project, setProject] = useState("");
  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    setSummary(null);
    try {
      setSummary(await api.summary(project));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <section>
      <h2>Project monthly cost</h2>
      <div className="row">
        <div>
          <label htmlFor="cost-project">Project</label>
          <input id="cost-project" value={project} onChange={(e) => setProject(e.target.value)} />
        </div>
        <button type="button" onClick={run}>Calculate</button>
      </div>
      {error && <p className="error">{error}</p>}
      {summary && (
        <p>
          <strong>{summary.project}</strong>: {summary.employeeCount} active employee(s) ×{" "}
          {summary.standardMonthlyHours} h → <strong>{summary.totalCost}</strong>
        </p>
      )}
    </section>
  );
}
