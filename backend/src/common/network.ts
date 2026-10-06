import net from "node:net";

/*
 * Node's "happy eyeballs" gives each address only 250 ms to connect and abandons slower attempts.
 * Neon (AWS us-east-2) is ~400 ms away from India, so every connection timed out (ETIMEDOUT).
 * A 2 s per-attempt timeout keeps IPv4/IPv6 fallback while allowing high-latency links.
 * Imported first by main.ts and the test setup.
 */
net.setDefaultAutoSelectFamilyAttemptTimeout(2_000);
