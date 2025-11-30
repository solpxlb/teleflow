// Cache Manager for Analytics
// Manages caching of computed metrics to improve performance

import { CacheEntry, CacheConfig } from '../types/analytics';

const DEFAULT_CONFIG: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    cleanupInterval: 60 * 1000, // 1 minute
};

class CacheManager {
    private cache: Map<string, CacheEntry<any>>;
    private config: CacheConfig;
    private cleanupTimer: NodeJS.Timeout | null;

    constructor(config: Partial<CacheConfig> = {}) {
        this.cache = new Map();
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.cleanupTimer = null;
        this.startCleanup();
    }

    /**
     * Get a value from cache
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if entry has expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.value as T;
    }

    /**
     * Set a value in cache
     */
    set<T>(key: string, value: T, ttl?: number): void {
        // If cache is at max size, remove oldest entry
        if (this.cache.size >= this.config.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }

        const entry: CacheEntry<T> = {
            key,
            value,
            timestamp: Date.now(),
            ttl: ttl || this.config.defaultTTL,
        };

        this.cache.set(key, entry);
    }

    /**
     * Check if key exists and is valid
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Invalidate a specific cache entry
     */
    invalidate(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Invalidate all cache entries matching a pattern
     */
    invalidatePattern(pattern: string | RegExp): void {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getStats() {
        let validEntries = 0;
        let expiredEntries = 0;

        for (const entry of this.cache.values()) {
            if (Date.now() - entry.timestamp > entry.ttl) {
                expiredEntries++;
            } else {
                validEntries++;
            }
        }

        return {
            total: this.cache.size,
            valid: validEntries,
            expired: expiredEntries,
            maxSize: this.config.maxSize,
            hitRate: 0, // TODO: Implement hit rate tracking
        };
    }

    /**
     * Remove expired entries
     */
    private cleanup(): void {
        const now = Date.now();

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Start automatic cleanup
     */
    private startCleanup(): void {
        this.cleanupTimer = setInterval(() => {
            this.cleanup();
        }, this.config.cleanupInterval);
    }

    /**
     * Stop automatic cleanup
     */
    stopCleanup(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
    }

    /**
     * Destroy cache manager
     */
    destroy(): void {
        this.stopCleanup();
        this.clear();
    }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Also export class for testing
export { CacheManager };
