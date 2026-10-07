// Resolve hook for scratch verification scripts: maps "@/..." to frontend/src and adds .ts/.tsx extensions.
import { existsSync, statSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
const SRC = new URL("../../frontend/src/", import.meta.url).pathname;
const SHARED = new URL("../../packages/shared/src/", import.meta.url).pathname;
const tryFile = (base) => [base, base + ".ts", base + ".tsx", base + "/index.ts", base + "/index.tsx"].find((p) => existsSync(p) && statSync(p).isFile());
export async function resolve(specifier, context, next) {
  let base = null;
  if (specifier.startsWith("@/")) base = SRC + specifier.slice(2);
  else if (specifier.startsWith("@nivora/shared/")) base = SHARED + specifier.slice(15);
  else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    base = fileURLToPath(new URL(specifier, context.parentURL));
  }
  if (base) {
    const file = tryFile(base);
    if (file) return next(pathToFileURL(file).href, context);
  }
  return next(specifier, context);
}
