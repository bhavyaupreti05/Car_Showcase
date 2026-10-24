/**
 * Sliding Window Token-Bucket Rate Limiting Middleware
 * Production system design algorithm to protect AI APIs from abuse and DDoS.
 */
export const createRateLimiter = ({
  windowMs = 60 * 1000, // 1 minute window
  maxRequests = 30,     // Max requests per window
  message = 'Too many requests from this IP, please try again later.',
} = {}) => {
  const ipBuckets = new Map();

  // Periodic cleanup of stale IP buckets every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of ipBuckets.entries()) {
      if (now - bucket.resetTime > windowMs) {
        ipBuckets.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    let bucket = ipBuckets.get(clientIp);

    if (!bucket || now > bucket.resetTime) {
      bucket = {
        tokens: maxRequests - 1,
        resetTime: now + windowMs,
      };
      ipBuckets.set(clientIp, bucket);
    } else {
      if (bucket.tokens > 0) {
        bucket.tokens--;
      } else {
        const retryAfterSeconds = Math.ceil((bucket.resetTime - now) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil(bucket.resetTime / 1000));

        return res.status(429).json({
          success: false,
          error: {
            status: 429,
            code: 'RATE_LIMIT_EXCEEDED',
            message,
            retryAfterSeconds,
          },
        });
      }
    }

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', bucket.tokens);
    res.setHeader('X-RateLimit-Reset', Math.ceil(bucket.resetTime / 1000));
    next();
  };
};

// Preset limiters
export const standardApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
});

export const aiEndpointLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'AI advisor quota reached for this minute. Please wait 60 seconds.',
});
