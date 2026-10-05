import { Redis } from "@upstash/redis";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");

for (const line of env.split("\n")) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    continue;
  }

  const index = trimmed.indexOf("=");

  if (index === -1) {
    continue;
  }

  const key = trimmed.slice(0, index);
  const value = trimmed.slice(index + 1);

  process.env[key] = value;
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

await redis.set("mecze:test", "dziala");

const result = await redis.get("mecze:test");

console.log("Redis:", result);

await redis.del("mecze:test");
