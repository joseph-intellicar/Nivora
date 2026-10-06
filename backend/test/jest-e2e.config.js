// End-to-end tests: test/**/*.e2e-spec.ts — the real app over HTTP with Supertest (barch §18).
/** @type {import("jest").Config} */
export default {
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["**/*.e2e-spec.ts"],
  globalSetup: "<rootDir>/global-setup.ts",
  setupFiles: ["<rootDir>/setup-env.ts"],
  // Neon is ~250 ms per round trip from India; booting the app (catalog load) takes a few seconds.
  testTimeout: 120_000,
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
  transform: { "^.+\\.ts$": ["ts-jest", { useESM: true, tsconfig: "<rootDir>/../tsconfig.json" }] },
};
