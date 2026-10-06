/**
 * Prisma's `?schema=` URL parameter is not understood by node-postgres, so it is removed from the
 * connection string and passed to the driver adapter instead (barch §14: tests use `nivora_test`).
 * TLS is always fully verified.
 */
export function splitSchema(url: string): { connectionString: string; schema: string | undefined } {
  const parsed = new URL(url);
  const schema = parsed.searchParams.get("schema") ?? undefined;
  parsed.searchParams.delete("schema");
  // node-postgres already treats sslmode=require as verify-full; say so explicitly (pg v9 will
  // switch `require` to weaker libpq semantics).
  if (parsed.searchParams.get("sslmode") === "require")
    parsed.searchParams.set("sslmode", "verify-full");
  return { connectionString: parsed.toString(), schema };
}

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/;

/**
 * Schema-qualified, quoted name for raw SQL, e.g. `"nivora_test"."orders"`.
 *
 * The adapter's `schema` option only qualifies Prisma's generated queries; raw SQL runs with
 * the default search_path (`public`), and Neon's pooler rejects a search_path startup option.
 * Every raw query must therefore name its tables through this helper, or tests would read and
 * write the real `public` data.
 */
export function qualify(schema: string, name: string): string {
  for (const part of [schema, name]) {
    if (!IDENTIFIER.test(part)) throw new Error(`Unsafe SQL identifier: ${part}`);
  }
  return `"${schema}"."${name}"`;
}
