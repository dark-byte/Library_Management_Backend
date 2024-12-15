import request from 'supertest';
import app from '../src/config/app'; 
import { connectDB, disconnectDB } from '../src/config/db'
import User from '../src/models/userModel'

let jwtToken: string;
let userId: string;
const bookData = {
  title: 'Test Book',
  author: 'Test Author',
  genre: 'Fiction',
  stock: 5,
  userId: ""
};

beforeAll(async () => {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/test-library-management'); 
  });
  
  afterAll(async () => {
    await User.findByIdAndDelete(userId);
    await disconnectDB(); // Clean up after tests
  });
  

describe('Book API Endpoints', () => {
  beforeAll(async () => {
    // Sign up and login to get JWT token
    const signUpResponse = await request(app).post('/users/signup').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      role: 'Author'
    });
    expect(signUpResponse.status).toBe(201);
    userId = signUpResponse.body.user._id;
    bookData.userId = userId;

    const loginResponse = await request(app).post('/users/login').send({
      email: 'johndoe@example.com',
      password: 'password123'
    });
    expect(loginResponse.status).toBe(200);
    jwtToken = loginResponse.body.token;
  });

  it('should create a new book on POST /books/create', async () => {
    const response = await request(app)
      .post('/books/create')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(bookData);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Book created successfully');
  });

  it('should get all books on GET /books', async () => {
    const response = await request(app).get('/books')
    .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get books by author on GET /books/author/:id', async () => {
    const response = await request(app).get(`/books/author/${userId}`)
    .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(200);
  });

  it('should update a book on PUT /books/update/:id', async () => {
    const bookResponse = await request(app)
      .post('/books/create')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(bookData);

    const bookId = bookResponse.body.book._id;
    const updatedBookData = { title: 'Updated Book Title' };

    const response = await request(app)
      .put(`/books/update/${bookId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updatedBookData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book updated successfully');
  });

  it('should delete a book on DELETE /books/delete/:id', async () => {
    const bookResponse = await request(app)
      .post('/books/create')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(bookData);

    const bookId = bookResponse.body.book._id;

    const response = await request(app)
      .delete(`/books/delete/${bookId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book deleted successfully');
  });

});
