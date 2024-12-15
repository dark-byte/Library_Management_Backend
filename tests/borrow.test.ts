import request from 'supertest';
import app from '../src/config/app'; 
import { connectDB, disconnectDB } from '../src/config/db';
import User from '../src/models/userModel'; 
import Book from '../src/models/bookModel'; 

let jwtAuthorToken: string;
let jwtReaderToken: string;
let bookId: string;
let readerId: string;
let authorId: string;

const authorData = {
  name: 'Author Jane',
  email: 'authorjane@example.com',
  password: 'authorpassword123',
  role: 'Author'
};

const readerData = {
  name: 'Reader John',
  email: 'readerjohn@example.com',
  password: 'readerpassword123',
  role: 'Reader'
};

const borrowData = {
  userId: '',
  bookId: ''
};

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/test-library-management'); 
});

afterAll(async () => {
  // Clean up users and books after tests
  await User.deleteMany({ email: { $in: [authorData.email, readerData.email] } });
  await Book.deleteMany({ _id: bookId });
  await disconnectDB();
});

describe('Borrow API Endpoints', () => {
  beforeAll(async () => {
    // Author signs up and creates a book
    const authorSignUpResponse = await request(app).post('/users/signup').send(authorData);
    authorId = authorSignUpResponse.body.user._id
    expect(authorSignUpResponse.status).toBe(201);

    const authorLoginResponse = await request(app).post('/users/login').send({
      email: authorData.email,
      password: authorData.password
    });
    expect(authorLoginResponse.status).toBe(200);
    jwtAuthorToken = authorLoginResponse.body.token;

    // Create a book as the author
    const bookResponse = await request(app)
      .post('/books/create')
      .set('Authorization', `Bearer ${jwtAuthorToken}`)
      .send({
        title: 'Test Book',
        author: 'Author Jane',
        genre: 'Fiction',
        stock: 5,
        userId: authorId
      });

    expect(bookResponse.status).toBe(201);
    bookId = bookResponse.body.book._id;

    // Reader signs up
    const readerSignUpResponse = await request(app).post('/users/signup').send(readerData);
    expect(readerSignUpResponse.status).toBe(201);
    readerId = readerSignUpResponse.body.user._id;

    const readerLoginResponse = await request(app).post('/users/login').send({
      email: readerData.email,
      password: readerData.password
    });
    expect(readerLoginResponse.status).toBe(200);
    jwtReaderToken = readerLoginResponse.body.token;

    borrowData.userId = readerId;
    borrowData.bookId = bookId;
  });

  it('should borrow a book on POST /reader/books/borrow', async () => {
    const response = await request(app)
      .post('/reader/books/borrow')
      .set('Authorization', `Bearer ${jwtReaderToken}`)
      .send(borrowData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book borrowed successfully');
  });

  it('should get borrowed books on GET /reader/books/:id', async () => {
    const response = await request(app)
      .get(`/reader/books/${readerId}`)
      .set('Authorization', `Bearer ${jwtReaderToken}`);
    expect(response.status).toBe(200);
    expect(response.body.borrowedBooks).toBeDefined();
    expect(response.body.borrowedBooks.length).toBeGreaterThan(0);
  });

  it('should return a borrowed book on POST /reader/books/return', async () => {
    const response = await request(app)
      .post('/reader/books/return')
      .set('Authorization', `Bearer ${jwtReaderToken}`)
      .send(borrowData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book returned successfully');
  });
});
