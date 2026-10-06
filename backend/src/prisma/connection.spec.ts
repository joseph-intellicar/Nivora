import { qualify, splitSchema } from "./connection.js";

describe("splitSchema (barch §14)", () => {
  it("moves ?schema= to the adapter option and enforces full TLS verification", () => {
    const { connectionString, schema } = splitSchema(
      "postgresql://u:p@host-pooler.neon.tech/neondb?sslmode=require&channel_binding=require&schema=nivora_test",
    );
    expect(schema).toBe("nivora_test");
    expect(connectionString).toBe(
      "postgresql://u:p@host-pooler.neon.tech/neondb?sslmode=verify-full&channel_binding=require",
    );
  });

  it("leaves URLs without a schema alone (public schema)", () => {
    expect(splitSchema("postgresql://u:p@host/db?sslmode=verify-full")).toEqual({
      connectionString: "postgresql://u:p@host/db?sslmode=verify-full",
      schema: undefined,
    });
  });
});

describe("qualify (raw SQL must name its schema)", () => {
  it("quotes schema and table", () => {
    expect(qualify("nivora_test", "orders")).toBe('"nivora_test"."orders"');
  });

  it("rejects anything that is not a plain identifier", () => {
    expect(() => qualify("public", 'orders"; DROP TABLE users; --')).toThrow(
      /Unsafe SQL identifier/,
    );
    expect(() => qualify("Public", "orders")).toThrow();
  });
});
