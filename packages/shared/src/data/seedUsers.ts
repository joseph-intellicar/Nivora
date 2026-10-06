/**
 * Predefined test user (requirements §7.1). Seeded into mock storage once; never logged in
 * automatically. Phase 1 mock only: real credential handling is a Phase 2 concern (req §5.3).
 */
export const TEST_USER = {
  id: "user-joseph",
  name: "Joseph",
  email: "joseph@example.com",
  password: "password123",
} as const;
