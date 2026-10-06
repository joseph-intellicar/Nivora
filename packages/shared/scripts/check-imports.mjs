// Lint rule for @nivora/shared: pure TypeScript only — no framework imports, no app aliases.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const FORBIDDEN = [
  /from "react/,
  /from "next/,
  /from "@nestjs\//,
  /from "@prisma\//,
  /from "@\//,
  /from "zustand"/,
  /from "@tanstack\//,
];
const files = [];
const walk = (dir) =>
  readdirSync(dir).forEach((f) =>
    statSync(join(dir, f)).isDirectory()
      ? walk(join(dir, f))
      : /\.tsx?$/.test(f) && files.push(join(dir, f)),
  );
walk(new URL("../src", import.meta.url).pathname);
const problems = files.flatMap((file) =>
  readFileSync(file, "utf8")
    .split("\n")
    .flatMap((line, i) =>
      FORBIDDEN.some((re) => re.test(line)) ? [`${file}:${i + 1}: ${line.trim()}`] : [],
    ),
);
if (problems.length) {
  console.error("Forbidden imports in @nivora/shared:\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`@nivora/shared: ${files.length} files, no framework or app-alias imports`);
