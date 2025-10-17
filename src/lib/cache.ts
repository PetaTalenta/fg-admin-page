/**
 * Cache Utilities
 * Client-side caching utilities for performance optimization
 */

interface CacheItem<T = unknown> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheManager {
  private cache: Map<string, CacheItem<unknown>>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Set cache item
   */
  set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    });
  }

  /**
   * Get cache item
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    const now = Date.now();
    const age = now - item.timestamp;

    if (age > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Check if cache has valid item
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete cache item
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired cache items
   */
  clearExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      const age = now - item.timestamp;
      if (age > item.expiresIn) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Clear expired cache every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.clearExpired();
  }, 5 * 60 * 1000);
}

