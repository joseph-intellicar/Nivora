import { ApiError, isApiError } from "../errors";
import { formatCount, formatDate, formatDateTime, formatPrice } from "../lib/format";

describe("ApiError (arch §7.3)", () => {
  it("is an Error carrying a code and details", () => {
    const error = new ApiError("OUT_OF_STOCK", { productName: "X" });
    expect(error).toBeInstanceOf(Error);
    expect(isApiError(error)).toBe(true);
    expect(error.code).toBe("OUT_OF_STOCK");
    expect(error.details).toEqual({ productName: "X" });
  });

  it("does not treat other values as ApiErrors", () => {
    expect(isApiError(new TypeError("boom"))).toBe(false);
    expect(isApiError({ code: "OUT_OF_STOCK" })).toBe(false);
    expect(isApiError("boom")).toBe(false);
  });
});

describe("India formatting", () => {
  it("formats rupees with Indian digit grouping", () => {
    expect(formatPrice(124999)).toBe("₹1,24,999");
    expect(formatPrice(40)).toBe("₹40");
    expect(formatCount(12345)).toBe("12,345");
  });

  it("formats dates in India time regardless of the machine's time zone", () => {
    expect(formatDate("2026-10-05T20:00:00.000Z")).toBe("6 Oct 2026");
    expect(formatDateTime("2026-10-06T10:35:00.000Z")).toMatch(/^6 Oct 2026, 4:05\spm$/);
  });
});
