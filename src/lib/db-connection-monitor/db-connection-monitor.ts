import { db } from "../db";
import redis from "../redis";

let lastCheck: { ok: boolean; error: string | null } | null = null;
let lastCheckedAt = 0;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
        ),
    ]);
}

export async function checkConnections(): Promise<{ ok: boolean; error: string | null }> {
    const now = performance.now();
    if (lastCheck && now - lastCheckedAt < 25_000) return lastCheck;

    let result: { ok: boolean; error: string | null } = { ok: true, error: null };

    try {
        await withTimeout(db.$queryRaw`SELECT 1`, 2000, "DB");
    } catch {
        result = { ok: false, error: "Failed to connect to database." };
    }

    try {
        if (!redis.isOpen) {
            await redis.connect();
        }
        await withTimeout(redis.ping(), 2000, "Redis");
    } catch {
        result = { ok: false, error: "Failed to connect to Redis." };
    }

    lastCheck = result;
    lastCheckedAt = now;

    return result;
}