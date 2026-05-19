import { describe, it, expect } from "vitest";
import { createEmployeeSchema, updateEmployeeSchema } from "../employees/employee.schema";

const valid = {
  firstName: "Anna",
  lastName: "Kowalska",
  position: "Dev",
  project: "Acme",
  hourlyRate: "85.00",
  status: "ACTIVE",
};

describe("createEmployeeSchema", () => {
  it("accepts a valid body and trims strings", () => {
    const parsed = createEmployeeSchema.parse({ ...valid, firstName: "  Anna  " });
    expect(parsed.firstName).toBe("Anna");
    expect(parsed.hourlyRate).toBe("85.00");
  });

  it("accepts a numeric hourlyRate and normalizes to string", () => {
    expect(createEmployeeSchema.parse({ ...valid, hourlyRate: 85 }).hourlyRate).toBe("85");
  });

  it("defaults status to ACTIVE when omitted", () => {
    const { status: _s, ...noStatus } = valid;
    expect(createEmployeeSchema.parse(noStatus).status).toBe("ACTIVE");
  });

  it("rejects empty/whitespace strings", () => {
    expect(() => createEmployeeSchema.parse({ ...valid, firstName: "   " })).toThrow();
  });

  it("rejects non-positive or >2dp hourlyRate", () => {
    expect(() => createEmployeeSchema.parse({ ...valid, hourlyRate: "0" })).toThrow();
    expect(() => createEmployeeSchema.parse({ ...valid, hourlyRate: "10.999" })).toThrow();
  });

  it("rejects an invalid status", () => {
    expect(() => createEmployeeSchema.parse({ ...valid, status: "PAUSED" })).toThrow();
  });

  it("strips unknown keys", () => {
    const parsed = createEmployeeSchema.parse({ ...valid, hacker: true } as Record<string, unknown>);
    expect("hacker" in parsed).toBe(false);
  });
});

describe("updateEmployeeSchema", () => {
  it("requires status (rejects when omitted) — a PUT must not silently flip status", () => {
    const { status: _s, ...noStatus } = valid;
    expect(() => updateEmployeeSchema.parse(noStatus)).toThrow();
  });

  it("accepts a full body with explicit status", () => {
    expect(updateEmployeeSchema.parse({ ...valid, status: "INACTIVE" }).status).toBe("INACTIVE");
  });
});
