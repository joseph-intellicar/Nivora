// Unit tests: src/**/*.spec.ts. Native ESM, because Nest 12 is ESM-only (barch §18).
/** @type {import("jest").Config} */
export default {
  testEnvironment: "node",
  rootDir: "src",
  testMatch: ["**/*.spec.ts"],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
  transform: { "^.+\\.ts$": ["ts-jest", { useESM: true, tsconfig: "<rootDir>/../tsconfig.json" }] },
  passWithNoTests: true,
};
