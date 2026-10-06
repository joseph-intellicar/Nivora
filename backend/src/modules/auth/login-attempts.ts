/**
 * Failed-login counter per email (barch §8): after MAX_FAILURES within the window, further
 * attempts for that email are refused until it expires, even from many IPs. In memory, like the
 * IP rate limiter; a successful login clears the count.
 */
export const MAX_FAILURES = 5;
export const FAILURE_WINDOW_MS = 15 * 60 * 1000;

export class LoginAttempts {
  private readonly failures = new Map<string, { count: number; resetAt: number }>();

  isLocked(email: string, now = Date.now()): boolean {
    const entry = this.failures.get(email);
    if (!entry || entry.resetAt <= now) return false;
    return entry.count >= MAX_FAILURES;
  }

  recordFailure(email: string, now = Date.now()): void {
    const entry = this.failures.get(email);
    if (!entry || entry.resetAt <= now) {
      if (this.failures.size > 50_000) this.failures.clear();
      this.failures.set(email, { count: 1, resetAt: now + FAILURE_WINDOW_MS });
    } else {
      entry.count += 1;
    }
  }

  clear(email: string): void {
    this.failures.delete(email);
  }
}
