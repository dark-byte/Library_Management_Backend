import express from 'express';
import { signUp, login, updateUser, deleteUser } from '../controller/userController';
import { validateSignup, validateLogin, handleValidationErrors } from '../utils/validators';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', validateSignup, handleValidationErrors, signUp);
router.post('/login', validateLogin, handleValidationErrors, login);
router.put('/update/:id', authenticate, updateUser);
router.delete('/delete/:id', authenticate, deleteUser);
router.get('/session/validate', authenticate, (req, res) => {
    res.status(200).json({ message: 'Session is valid' });
});
  

export default router;
