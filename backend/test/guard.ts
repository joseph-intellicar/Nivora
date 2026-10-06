/**
 * Refuses to run tests against anything but the `nivora_test` schema (barch §18). Real data lives
 * in `public` of the same database, so this check runs before any reset, migration or seed.
 */
export const TEST_SCHEMA = "nivora_test";

export function assertTestDatabase(env: NodeJS.ProcessEnv): void {
  const problems: string[] = [];
  if (env.NODE_ENV !== "test")
    problems.push(`NODE_ENV must be "test" (is "${env.NODE_ENV ?? ""}")`);
  if (env.TEST_SCHEMA !== TEST_SCHEMA) problems.push(`TEST_SCHEMA must be "${TEST_SCHEMA}"`);
  for (const key of ["DATABASE_URL", "DIRECT_URL"] as const) {
    const schema = schemaOf(env[key]);
    if (schema !== TEST_SCHEMA)
      problems.push(
        `${key} must use ?schema=${TEST_SCHEMA} (found ${schema ?? "no schema → public"})`,
      );
  }
  if (problems.length) {
    throw new Error(
      `Refusing to run tests outside the ${TEST_SCHEMA} schema:\n  - ${problems.join("\n  - ")}`,
    );
  }
}

function schemaOf(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).searchParams.get("schema") ?? undefined;
  } catch {
    return undefined;
  }
}
