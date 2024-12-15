import express from 'express';
import cors from 'cors';
import bodyParser = require('body-parser');
import userRoutes from '../routes/userRoutes';
import bookRoutes from '../routes/bookRoutes';
import borrowRoutes from '../routes/borrowRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/reader', borrowRoutes);

// Error handling middleware

export default app;
