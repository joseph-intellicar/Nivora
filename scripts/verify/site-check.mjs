const file = new URL("../../frontend/src/config/site.ts", import.meta.url).pathname;
const run = async (env, label) => {
  for (const k of Object.keys(process.env)) if (k.startsWith("NEXT_PUBLIC_")) delete process.env[k];
  Object.assign(process.env, env);
  const { siteConfig } = await import(file + "?" + label);
  console.log(label.padEnd(8), JSON.stringify(siteConfig));
};
await run({}, "defaults");
await run({ NEXT_PUBLIC_SITE_URL: "https://nivora.example/path", NEXT_PUBLIC_MOCK_LATENCY_MS: "0", NEXT_PUBLIC_ALLOW_INDEXING: "true" }, "valid");
await run({ NEXT_PUBLIC_SITE_URL: "not a url", NEXT_PUBLIC_MOCK_LATENCY_MS: "-5", NEXT_PUBLIC_DATA_SOURCE: "http", NEXT_PUBLIC_ALLOW_INDEXING: "yes" }, "invalid");
