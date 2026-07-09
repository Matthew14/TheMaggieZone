const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const MAX_TRACKED_KEYS = 10_000;

type FailureWindow = { count: number; resetAt: number };

// In-memory, so limits apply per serverless instance. Vercel's Fluid
// Compute reuses instances across requests, which makes this effective
// against bursts from a single source, but a platform-level WAF rule is
// still the stronger guarantee across instances.
const failures = new Map<string, FailureWindow>();

const prune = (now: number) => {
    if (failures.size < MAX_TRACKED_KEYS) {
        return;
    }
    failures.forEach((window, key) => {
        if (now > window.resetAt) {
            failures.delete(key);
        }
    });
};

export const isRateLimited = (key: string): boolean => {
    const window = failures.get(key);
    return !!window && Date.now() <= window.resetAt && window.count >= MAX_FAILURES;
};

export const recordFailure = (key: string): void => {
    const now = Date.now();
    prune(now);
    const window = failures.get(key);
    if (!window || now > window.resetAt) {
        failures.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return;
    }
    window.count++;
};

export const clearFailures = (key: string): void => {
    failures.delete(key);
};
