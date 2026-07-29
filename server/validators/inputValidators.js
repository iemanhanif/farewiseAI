import { body, query, validationResult } from 'express-validator';

// Middleware to check validation results and return errors
export const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateResults
];

export const loginValidator = [
  body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validateResults
];

export const searchValidator = [
  query('from').trim().notEmpty().withMessage('Departure city (from) is required'),
  query('to').trim().notEmpty().withMessage('Destination city (to) is required'),
  query('departureDate')
    .trim()
    .notEmpty()
    .withMessage('Departure date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Departure date must be in YYYY-MM-DD format'),
  query('class')
    .optional()
    .isIn(['Economy', 'Business', 'First'])
    .withMessage('Travel class must be Economy, Business, or First'),
  query('stops')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stops must be a non-negative integer'),
  validateResults
];

export const profileUpdateValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateResults
];

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  validateResults
];

export const resetPasswordValidator = [
  body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  body('token').notEmpty().withMessage('Token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateResults
];
