/**
 * High-Performance LRU In-Memory Cache with TTL & Latency Telemetry
 * Production design pattern for reducing database and LLM API cost.
 */
class CacheManager {
  constructor(maxSize = 250, defaultTTLSeconds = 300) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTLSeconds * 1000;
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      totalSavedLatencyMs: 0,
    };
  }

  generateKey(prefix, payload) {
    const serialized = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
    return `${prefix}:${serialized.toLowerCase().trim()}`;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);

    this.stats.hits++;
    this.stats.totalSavedLatencyMs += entry.savedLatencyMs || 250;
    return entry.value;
  }

  set(key, value, ttlSeconds = null, savedLatencyMs = 300) {
    if (this.cache.size >= this.maxSize) {
      // Evict oldest (first item in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }

    const ttl = (ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL);
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      savedLatencyMs,
      createdAt: Date.now(),
    });
    this.stats.sets++;
  }

  getMetrics() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? ((this.stats.hits / totalRequests) * 100).toFixed(1) + '%' : '0%';
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      evictions: this.stats.evictions,
      estimatedLatencySavedMs: this.stats.totalSavedLatencyMs,
    };
  }

  clear() {
    this.cache.clear();
  }
}

export const queryCache = new CacheManager(250, 300); // 5 min default TTL
export default queryCache;
