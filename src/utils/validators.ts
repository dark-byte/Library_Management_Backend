import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateSignup = [
  body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .notEmpty()
    .withMessage('Password is required'),
  body('role').isIn(['Reader', 'Author']).withMessage('Role must be either Reader or Author'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateBookCreation = [
  body('title').isString().withMessage('Title must be a string').notEmpty().withMessage('Title is required'),
  body('author').isString().withMessage('Author must be a string').notEmpty().withMessage('Author is required'),
  body('genre').isString().withMessage('Genre must be a string').notEmpty().withMessage('Genre is required'),
  body('stock')
    .isInt({ min: 1 })
    .withMessage('Stock must be an integer greater than 0')
    .notEmpty()
    .withMessage('Stock is required'),
];

export const validateBorrowRequest = [
  body('userId').isMongoId().withMessage('Valid userId is required'),
  body('bookId').isMongoId().withMessage('Valid bookId is required'),
];

export const validateReturnRequest = [
  body('userId').isMongoId().withMessage('Valid userId is required'),
  body('bookId').isMongoId().withMessage('Valid bookId is required'),
];

// Middleware to handle validation results
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return
  }
  next();
};
