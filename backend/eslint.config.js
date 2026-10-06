import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

/*
 * Backend lint rules (barch §4). Same conventions as the frontend: type-only imports say so;
 * business rules come from @nivora/shared, never from the frontend app.
 */
export default defineConfig([
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      // Nest DI reads constructor parameter types at runtime (decorator metadata), so the
      // type-import rule must know those imports are values.
      parserOptions: { emitDecoratorMetadata: true, experimentalDecorators: true },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Raw SQL only through tagged templates (parameterised) with schema-qualified names.
      "no-restricted-properties": [
        "error",
        { property: "$queryRawUnsafe", message: "Use $queryRaw with prisma.table(...) instead." },
        {
          property: "$executeRawUnsafe",
          message: "Use $executeRaw with prisma.table(...) instead.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/frontend/**", "@/*"],
              message: "The backend must not import frontend code.",
            },
            {
              group: ["**/packages/shared/**"],
              message: "Import shared code as '@nivora/shared/...'.",
            },
          ],
        },
      ],
    },
  },
  prettier,
  globalIgnores(["dist/**", "src/generated/**", "coverage/**"]),
]);
