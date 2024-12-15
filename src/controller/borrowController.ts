import { Request, Response } from 'express';
import Book from '../models/bookModel';
import User from '../models/userModel';

export const borrowBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) return res.status(404).json({ message: 'User or Book not found' });
    if (book.stock <= 0) return res.status(400).json({ message: 'Book out of stock' });

    if (user.borrowedBooks && user.borrowedBooks.length >= 5)
      return res.status(400).json({ message: 'Borrow limit reached' });

    user.borrowedBooks?.push(bookId);
    book.stock -= 1;

    await user.save();
    await book.save();

    res.status(200).json({ message: 'Book borrowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error borrowing book', error });
  }
};

// Function to return a borrowed book
export const returnBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) return res.status(404).json({ message: 'User or Book not found' });

    // Check if the book is in the user's borrowedBooks list
    if (!user.borrowedBooks?.includes(bookId))
      return res.status(400).json({ message: 'Book not borrowed by user' });

    // Remove the book from the user's borrowed books
    user.borrowedBooks = user.borrowedBooks.filter((id) => id.toString() !== bookId.toString());

    // Increase the stock of the book
    book.stock += 1;

    await user.save();
    await book.save();

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error returning book', error });
  }
};

// Function to get all borrowed books by a user
export const getBorrowedBooks = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('borrowedBooks');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ borrowedBooks: user.borrowedBooks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrowed books', error });
  }
};
