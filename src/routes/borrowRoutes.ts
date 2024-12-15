import express from 'express';
import { borrowBook, returnBook, getBorrowedBooks } from '../controller/borrowController';
import { validateBorrowRequest, validateReturnRequest, handleValidationErrors } from '../utils/validators';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes
router.post('/books/borrow', authenticate, validateBorrowRequest, handleValidationErrors, borrowBook);
router.post('/books/return', authenticate, validateReturnRequest, handleValidationErrors, returnBook);
router.get('/books/:id', authenticate, getBorrowedBooks);

export default router;
