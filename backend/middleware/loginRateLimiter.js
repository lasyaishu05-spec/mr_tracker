const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

// Cache to track login attempts by email
// stdTTL is in seconds. 15 mins = 900 seconds
const loginAttemptsCache = new NodeCache({ stdTTL: 900 });

// 1. IP Rate Limiter (Max 10 requests per minute per IP)
const ipRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, errors: [{ msg: "Too many login requests from this IP, please try again after a minute." }] },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Account Lockout & Progressive Delay Middleware
const accountLockoutLimiter = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(); // Let validation middleware handle missing email
  }

  const attemptsData = loginAttemptsCache.get(email) || { count: 0, lockedUntil: null };

  // Check if account is locked
  if (attemptsData.lockedUntil && attemptsData.lockedUntil > Date.now()) {
    // Return generic message to prevent user enumeration
    return res.status(401).json({ success: false, message: "Incorrect email or password" });
  } else if (attemptsData.lockedUntil && attemptsData.lockedUntil <= Date.now()) {
    // Lockout expired, reset attempts
    attemptsData.count = 0;
    attemptsData.lockedUntil = null;
    loginAttemptsCache.set(email, attemptsData);
  }

  // Calculate progressive delay (e.g., attempt 1 = 0s, attempt 2 = 1s, attempt 3 = 2s)
  const delaySeconds = Math.max(0, attemptsData.count - 1);
  if (delaySeconds > 0) {
    await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
  }

  // Attach cache to req for the controller to use
  req.loginAttemptsCache = loginAttemptsCache;
  next();
};

module.exports = {
  ipRateLimiter,
  accountLockoutLimiter,
  loginAttemptsCache // Exported for access in controllers if needed
};
