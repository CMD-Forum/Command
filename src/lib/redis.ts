import { createClient } from "redis";
import { log } from "./utils";

let errorLogged = false;

const redis = await createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379"
})
    .on("error", error => {
        if (!errorLogged) {
            log({ message: "Redis Client experienced an error: " + error, type: "error" });
            errorLogged = true;
        }
    })

if (!redis.isOpen) {
    try {
        await redis.connect();
    } catch (error) {
        if (!errorLogged) {
            log({ message: "Failed to connect to Redis: " + error, type: "error" });
            errorLogged = true;
        }
        throw error;
    }
}

export default redis;