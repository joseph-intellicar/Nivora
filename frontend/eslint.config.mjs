import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

/*
 * Architecture boundaries (docs/architecture.md §4 and §20).
 * Imports must use the "@/" alias so these rules can see them.
 * Business rules (domain, validation, constants, formatting, listing params) live in the
 * `@nivora/shared` package, which enforces its own purity (no React/Next/Nest imports).
 */

const MOCK_AND_DATA = [
  {
    group: ["**/packages/shared/**"],
    message: "Import shared code through the package: '@nivora/shared/...'.",
  },
  {
    group: ["@/api/*/mock", "@/api/*/mock/*"],
    message: "Mock adapters are internal to src/api. Import from '@/api/client' or '@/api/server'.",
  },
  {
    group: ["@nivora/shared/data", "@nivora/shared/data/*"],
    message: "Catalog and seed data may only be read inside src/api.",
  },
];

const CLIENT_ONLY = [
  {
    group: ["@/api/client", "@/api/client/*", "@/stores", "@/stores/*"],
    message: "Server code must not import browser-only data APIs or UI stores.",
  },
];

const SERVER_ONLY = [
  {
    group: ["@/api/server", "@/api/server/*"],
    message: "Browser code must not import the server catalog API.",
  },
];

const restrictImports = (...groups) => ({
  "no-restricted-imports": ["error", { patterns: groups.flat() }],
});

/** Flags 'use client' files that import server-only modules (catalog API, mock data). */
const nivoraPlugin = {
  rules: {
    "client-boundary": {
      meta: {
        type: "problem",
        messages: {
          serverOnly:
            "'{{source}}' is server-only and must not be imported by a 'use client' file.",
        },
        schema: [],
      },
      create(context) {
        let isClientFile = false;
        const serverOnly =
          /^@\/api\/server(\/|$)|^@nivora\/shared\/data(\/|$)|^@\/api\/[^/]+\/mock(\/|$)/;
        return {
          Program(node) {
            isClientFile = node.body.some(
              (statement) =>
                statement.type === "ExpressionStatement" && statement.directive === "use client",
            );
          },
          ImportDeclaration(node) {
            const source = node.source.value;
            if (isClientFile && typeof source === "string" && serverOnly.test(source)) {
              context.report({ node, messageId: "serverOnly", data: { source } });
            }
          },
        };
      },
    },
  },
};

const STORAGE_GLOBALS = ["localStorage", "sessionStorage"].map((name) => ({
  name,
  message: "Use the data layer. Only src/api/client/mock/storage.ts may access browser storage.",
}));

const STORAGE_PROPERTIES = ["window", "globalThis", "self"].flatMap((object) =>
  ["localStorage", "sessionStorage"].map((property) => ({
    object,
    property,
    message: "Use the data layer. Only src/api/client/mock/storage.ts may access browser storage.",
  })),
);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Everywhere in src: no browser storage, no mock adapters or mock data.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { nivora: nivoraPlugin },
    rules: {
      "no-restricted-globals": ["error", ...STORAGE_GLOBALS],
      "no-restricted-properties": ["error", ...STORAGE_PROPERTIES],
      "nivora/client-boundary": "error",
      // Type-only imports must say so (keeps runtime imports explicit and lets scripts run the source).
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      ...restrictImports(MOCK_AND_DATA),
    },
  },

  // Route files are thin server modules: no browser-only data APIs or stores.
  {
    files: [
      "src/app/**/{page,layout,template,loading,error,not-found,global-error,default}.tsx",
      "src/app/**/{sitemap,robots}.ts",
    ],
    rules: restrictImports(MOCK_AND_DATA, CLIENT_ONLY),
  },

  // Browser-side shared code.
  {
    files: ["src/{stores,providers,hooks}/**/*.{ts,tsx}"],
    rules: restrictImports(MOCK_AND_DATA, SERVER_ONLY),
  },

  // Shared UI kit has no business knowledge.
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: restrictImports(MOCK_AND_DATA, [
      {
        group: ["@/features", "@/features/*", "@/api", "@/api/*"],
        message: "Shared UI components must not depend on features or the data layer.",
      },
    ]),
  },

  // Data layer: may read mock data; server and client sides stay separate.
  {
    files: ["src/api/**/*.ts"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    files: ["src/api/server/**/*.ts"],
    rules: restrictImports(CLIENT_ONLY),
  },
  {
    files: ["src/api/client/**/*.ts"],
    rules: restrictImports(SERVER_ONLY),
  },

  // The single module allowed to touch browser storage.
  {
    files: ["src/api/client/mock/storage.ts"],
    rules: {
      "no-restricted-globals": "off",
      "no-restricted-properties": "off",
    },
  },

  // Turn off stylistic rules that conflict with Prettier (must stay last).
  prettier,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
