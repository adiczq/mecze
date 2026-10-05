import { Redis } from "@upstash/redis";
import type { Match } from "@/lib/types";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({
    url,
    token,
  });
}

function getKey(matchId: string) {
  return `match-video:${matchId}`;
}

export async function getMatchVideo(matchId: string): Promise<string | null> {
  const redis = getRedis();

  if (!redis) {
    return null;
  }

  return redis.get<string>(getKey(matchId));
}

export async function setMatchVideo(matchId: string, youtubeUrl: string) {
  const redis = getRedis();

  if (!redis) {
    throw new Error("Brak konfiguracji Upstash Redis.");
  }

  await redis.set(getKey(matchId), youtubeUrl);
}

export async function deleteMatchVideo(matchId: string) {
  const redis = getRedis();

  if (!redis) {
    throw new Error("Brak konfiguracji Upstash Redis.");
  }

  await redis.del(getKey(matchId));
}

export async function attachMatchVideos(matches: Match[]): Promise<Match[]> {
  const redis = getRedis();

  if (!redis || matches.length === 0) {
    return matches;
  }

  return Promise.all(
    matches.map(async (match) => {
      const youtubeUrl = await redis.get<string>(getKey(match.id));

      return {
        ...match,
        youtubeUrl: youtubeUrl || undefined,
      };
    })
  );
}
