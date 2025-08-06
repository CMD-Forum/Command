import { createClient } from "redis";

const redis = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
    socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
            if (retries > 5) return new Error("Too many retries");
            return 100 * retries;
        },
    }
});

redis.on("connect", () => console.log("[Redis] Connected to Redis server"));
redis.on("reconnecting", () => console.log("[Redis] Reconnecting..."));
redis.on("error", (err) => console.error("[Redis] Error occurred: ", err));

if (!redis.isOpen) {
    redis.connect().catch((err) => {
        console.error("[Redis] Initial connection failed:", err);
    });
}

export default redis;