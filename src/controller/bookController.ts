import { Request, Response } from 'express';
import Book from '../models/bookModel';

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, genre, stock, userId } = req.body;
    const book = new Book({ title, author, genre, stock, user: userId });
    await book.save();
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error });
  }
};

export const getAuthorBooks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const books = await Book.find({ user: id });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving author books', error });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    delete req.body.user
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Book updated successfully', updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error });
  }
};
