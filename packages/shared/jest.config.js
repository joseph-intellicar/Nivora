/** Jest for @nivora/shared: TypeScript tests next to the source (barch §18). */
/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: { "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.test.json" }] },
  collectCoverageFrom: ["src/domain/**/*.ts", "src/lib/**/*.ts", "src/errors.ts"],
  coverageReporters: ["text-summary", "text"],
};
