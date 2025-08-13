import { Redis } from '@upstash/redis';

// 检查 Redis 环境变量是否可用
const isRedisAvailable = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

export const redis = isRedisAvailable ? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
}) : null;

// 类型安全的缓存工具类
export class CacheManager {
  static async get<T>(key: string): Promise<T | null> {
    if (!redis) {
      console.warn('Redis not available, returning null for key:', key);
      return null;
    }
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  static async set<T>(
    key: string, 
    value: T, 
    options?: { ex?: number; px?: number }
  ): Promise<boolean> {
    if (!redis) {
      console.warn('Redis not available, skipping set for key:', key);
      return false;
    }
    try {
      if (options?.ex) {
        await redis.set(key, value, { ex: options.ex });
      } else if (options?.px) {
        await redis.set(key, value, { px: options.px });
      } else {
        await redis.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    if (!redis) {
      console.warn('Redis not available, skipping del for key:', key);
      return false;
    }
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis del error:', error);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    if (!redis) {
      console.warn('Redis not available, returning false for exists check:', key);
      return false;
    }
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  static async ttl(key: string): Promise<number> {
    if (!redis) {
      console.warn('Redis not available, returning -1 for ttl check:', key);
      return -1;
    }
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error('Redis ttl error:', error);
      return -1;
    }
  }

  static async increment(key: string, amount: number = 1): Promise<number> {
    if (!redis) {
      console.warn('Redis not available, returning 0 for increment:', key);
      return 0;
    }
    try {
      return await redis.incrby(key, amount);
    } catch (error) {
      console.error('Redis increment error:', error);
      return 0;
    }
  }

  static async expire(key: string, seconds: number): Promise<boolean> {
    if (!redis) {
      console.warn('Redis not available, skipping expire for key:', key);
      return false;
    }
    try {
      const result = await redis.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.error('Redis expire error:', error);
      return false;
    }
  }
}