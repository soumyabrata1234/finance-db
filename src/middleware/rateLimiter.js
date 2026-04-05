const rateLimit = require("express-rate-limit");

// General limiter for all routes..
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10,                  
  standardHeaders: true,    
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again after 1 minute.",
  },
});


const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10,                   
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts, please try again after 1 minutes.",
  },
});

module.exports = { globalLimiter, authLimiter };