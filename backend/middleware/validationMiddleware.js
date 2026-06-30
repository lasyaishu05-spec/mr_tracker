const { validationResult, body, query } = require('express-validator');
const { z } = require('zod');
const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (val) => {
  if (typeof val !== 'string') return val;
  // Strip HTML tags and script tags
  let sanitized = sanitizeHtml(val, {
    allowedTags: [],
    allowedAttributes: {},
  });
  // Strip special characters except some standard ones like @, ., -, _
  return sanitized.replace(/[<>{}[\];'"\\`&=$^]/g, '');
};

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long").transform(sanitizeInput),
  email: z.string().email("Invalid email format").transform(sanitizeInput),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long").transform(sanitizeInput)
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format").transform(sanitizeInput),
  password: z.string().min(1, "Password is required").transform(sanitizeInput)
});

const registerValidation = (req, res, next) => {
  try {
    req.body = registerSchema.parse(req.body);
    next();
  } catch (err) {
    console.error(`[Validation Error - Register]: ${err.message}`);
    return res.status(400).json({ success: false, errors: [{ msg: "Invalid input" }] });
  }
};

const loginValidation = (req, res, next) => {
  try {
    req.body = loginSchema.parse(req.body);
    next();
  } catch (err) {
    console.error(`[Validation Error - Login]: ${err.message}`);
    return res.status(400).json({ success: false, errors: [{ msg: "Invalid input" }] });
  }
};

// Keeping the original validator setup for other routes temporarily
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const changePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  handleValidationErrors
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  paginationValidation
};
