import argon2 from "argon2";

/** argon2id with the library defaults (64 MiB, 3 passes, 4 lanes) — barch §8. */
export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

/** Constant-time check; false (never an exception) for a malformed hash. */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
