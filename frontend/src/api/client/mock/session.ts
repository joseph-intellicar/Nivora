import type { User } from "@/domain/types";
import { ApiError } from "../../errors";
import type { SessionRecord, StoredUser } from "./records";
import { isArray, isRecord, KEYS, read, remove, write } from "./storage";

export function readUsers(): StoredUser[] {
  return read<StoredUser[]>(KEYS.users, [], isArray);
}

export function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    ...(user.phone ? { phone: user.phone } : {}),
  };
}

/**
 * The logged-in user, or null for a guest. A malformed session, or one pointing to a user
 * that no longer exists, is treated as a guest (requirements §7.4).
 */
export function currentUser(): StoredUser | null {
  const session = read<SessionRecord | null>(KEYS.authSession, null, isRecord);
  if (!session || typeof session.userId !== "string") return null;
  return readUsers().find((user) => user.id === session.userId) ?? null;
}

/** Like a server reading the auth cookie: throws UNAUTHENTICATED for guests. */
export function requireUser(): StoredUser {
  const user = currentUser();
  if (!user) throw new ApiError("UNAUTHENTICATED");
  return user;
}

export function startSession(userId: string): void {
  write<SessionRecord>(KEYS.authSession, { userId, createdAt: new Date().toISOString() });
}

export function endSession(): void {
  remove(KEYS.authSession);
}
