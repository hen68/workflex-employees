import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";
import { calculateProjectCost } from "../employees/employee.service";

const emp = (hourlyRate: string, status: "ACTIVE" | "INACTIVE") =>
  ({ hourlyRate: new Prisma.Decimal(hourlyRate), status }) as const;

describe("calculateProjectCost", () => {
  it("returns 0.00 for no employees", () => {
    expect(calculateProjectCost([], 168)).toBe("0.00");
  });

  it("excludes INACTIVE employees", () => {
    expect(calculateProjectCost([emp("100.00", "ACTIVE"), emp("100.00", "INACTIVE")], 168)).toBe(
      "16800.00",
    );
  });

  it("sums multiple ACTIVE employees", () => {
    // (85.00 + 70.50) * 168 = 26124.00
    expect(calculateProjectCost([emp("85.00", "ACTIVE"), emp("70.50", "ACTIVE")], 168)).toBe(
      "26124.00",
    );
  });

  it("keeps cent precision (no float drift)", () => {
    // (0.10 + 0.20) * 3 = 0.90 exactly
    expect(calculateProjectCost([emp("0.10", "ACTIVE"), emp("0.20", "ACTIVE")], 3)).toBe("0.90");
  });
});
