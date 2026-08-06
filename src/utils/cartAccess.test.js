import { describe, it, expect } from "vitest";
import { canAccessCart } from "./cartAccess";

describe("canAccessCart", () => {
  it("allows access for authenticated users", () => {
    expect(canAccessCart({ id: 1 })).toBe(true);
  });

  it("blocks access for unauthenticated users", () => {
    expect(canAccessCart(null)).toBe(false);
  });
});
