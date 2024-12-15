import express from 'express';
import { createBook, getBooks, updateBook, deleteBook, getAuthorBooks } from '../controller/bookController';
import { validateBookCreation, handleValidationErrors } from '../utils/validators';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Public route
router.get('/', authenticate, getBooks);

// Protected routes
router.post('/create', authenticate, validateBookCreation, handleValidationErrors, createBook);
router.get('/author/:id', authenticate, getAuthorBooks);
router.put('/update/:id', authenticate, updateBook);
router.delete('/delete/:id', authenticate, deleteBook);

export default router;
