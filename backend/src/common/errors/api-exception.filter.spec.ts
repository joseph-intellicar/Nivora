import { jest } from "@jest/globals";
import { type ArgumentsHost, Logger } from "@nestjs/common";
import { BadRequestException, NotFoundException, PayloadTooLargeException } from "@nestjs/common";
import { messageFor } from "@nivora/shared/errorMessages";
import { API_ERROR_CODES, ApiError, type ApiErrorCode } from "@nivora/shared/errors";
import { ApiExceptionFilter, type ErrorEnvelope } from "./api-exception.filter.js";

const EXPECTED_STATUS: Record<ApiErrorCode, number> = {
  VALIDATION: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INVALID_CREDENTIALS: 401,
  EMAIL_TAKEN: 409,
  VARIANT_REQUIRED: 400,
  INVALID_VARIANT: 400,
  OUT_OF_STOCK: 409,
  INSUFFICIENT_STOCK: 409,
  INVALID_QUANTITY: 400,
  EMPTY_CART: 409,
  ADDRESS_REQUIRED: 409,
  INVALID_ADDRESS: 422,
  ORDER_NOT_CANCELLABLE: 409,
  RATE_LIMITED: 429,
  UNKNOWN: 500,
};

function run(exception: unknown): { status: number; body: ErrorEnvelope } {
  const result = { status: 0, body: undefined as unknown as ErrorEnvelope };
  const res = {
    headersSent: false,
    status(code: number) {
      result.status = code;
      return this;
    },
    json(body: ErrorEnvelope) {
      result.body = body;
      return this;
    },
  };
  const req = { method: "GET", originalUrl: "/api/v1/test?q=1", requestId: "test-id" };
  const host = {
    switchToHttp: () => ({ getRequest: () => req, getResponse: () => res }),
  } as unknown as ArgumentsHost;
  new ApiExceptionFilter().catch(exception, host);
  return result;
}

describe("ApiExceptionFilter (barch §7)", () => {
  const logged = jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
  beforeEach(() => logged.mockClear());
  afterAll(() => logged.mockRestore());

  it.each(API_ERROR_CODES.map((code) => [code]))(
    "%s → status and req §28 message in the envelope",
    (code) => {
      const { status, body } = run(new ApiError(code));
      expect(status).toBe(EXPECTED_STATUS[code]);
      expect(body).toEqual({ error: { code, message: messageFor(code), details: {} } });
    },
  );

  it("does not log expected errors", () => {
    run(new ApiError("OUT_OF_STOCK"));
    run(new NotFoundException());
    expect(logged).not.toHaveBeenCalled();
  });

  it("keeps details and builds the message from them", () => {
    const { status, body } = run(
      new ApiError("INSUFFICIENT_STOCK", { available: 2, productName: "Aurora Sneakers" }),
    );
    expect(status).toBe(409);
    expect(body.error.message).toBe(
      "Only 2 units of Aurora Sneakers are available. Please update the quantity.",
    );
    expect(body.error.details).toEqual({ available: 2, productName: "Aurora Sneakers" });
  });

  it("uses 422 for field validation errors", () => {
    const { status, body } = run(
      new ApiError("VALIDATION", { fields: { email: "Please enter your email." } }),
    );
    expect(status).toBe(422);
    expect(body.error.details.fields).toEqual({ email: "Please enter your email." });
  });

  it("maps framework HTTP errors onto shared codes, keeping precise statuses", () => {
    expect(run(new NotFoundException("Cannot GET /x"))).toMatchObject({
      status: 404,
      body: { error: { code: "NOT_FOUND" } },
    });
    expect(run(new BadRequestException("bad"))).toMatchObject({
      status: 400,
      body: { error: { code: "VALIDATION" } },
    });
    expect(run(new PayloadTooLargeException())).toMatchObject({
      status: 413,
      body: { error: { code: "VALIDATION" } },
    });
  });

  it("maps body-parser errors (malformed JSON) to VALIDATION 400", () => {
    const parseError = Object.assign(new SyntaxError("Unexpected token } in JSON"), {
      status: 400,
      type: "entity.parse.failed",
    });
    const { status, body } = run(parseError);
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
    expect(JSON.stringify(body)).not.toContain("Unexpected token");
  });

  it("maps Prisma 'record not found' to NOT_FOUND", () => {
    expect(run(Object.assign(new Error("No record"), { code: "P2025" }))).toMatchObject({
      status: 404,
    });
  });

  it("hides unexpected errors behind UNKNOWN 500", () => {
    const { status, body } = run(
      new TypeError("Cannot read properties of undefined (reading 'secret')"),
    );
    expect(status).toBe(500);
    expect(body).toEqual({
      error: { code: "UNKNOWN", message: "Something went wrong. Please try again.", details: {} },
    });
    expect(logged).toHaveBeenCalledWith(
      expect.stringContaining("GET /api/v1/test id=test-id: TypeError: Cannot read properties"),
      expect.any(String),
    );
    expect(run(Object.assign(new Error("db down"), { code: "P1001" })).status).toBe(500);
    expect(run("a string").status).toBe(500);
  });
});
