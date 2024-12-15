import request from 'supertest';
import app from '../src/config/app';
import { connectDB, disconnectDB } from '../src/config/db';
import User from '../src/models/userModel';

let jwtToken: string;
let userId: string; // Store the user ID
const userData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: 'password123',
  role: 'Reader'
};

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/test-library-management');
});

afterAll(async () => {
  await User.findByIdAndDelete(userId);
  await disconnectDB(); // Clean up after tests
});

describe('User API Endpoints', () => {
  beforeAll(async () => {
    // Sign up the user
    const signUpResponse = await request(app).post('/users/signup').send(userData);
    expect(signUpResponse.status).toBe(201);
    expect(signUpResponse.body.user).toBeDefined();
    userId = signUpResponse.body.user._id; // Save the user ID

    // Log in to get JWT token
    const loginResponse = await request(app).post('/users/login').send({
      email: userData.email,
      password: userData.password
    });
    expect(loginResponse.status).toBe(200);
    jwtToken = loginResponse.body.token; // Save token
  });

  it('should create a new user on POST /users/signup', async () => {
    const response = await request(app).post('/users/signup').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password123',
      role: 'Reader'
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should login a user on POST /users/login', async () => {
    const response = await request(app).post('/users/login').send({
      email: userData.email,
      password: userData.password
    });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should update a user on PUT /users/update/:id', async () => {
    const response = await request(app)
      .put(`/users/update/${userId}`) // Use the saved user ID
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Updated Name' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
    expect(response.body.user.name).toBe('Updated Name'); // Confirm the update
  });

  it('should validate session on GET /users/session/validate', async () => {
    const response = await request(app)
      .get('/users/session/validate')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Session is valid');
  });

  it('should delete a user on DELETE /users/delete/:id', async () => {
    const response = await request(app)
      .delete(`/users/delete/${userId}`) // Use the saved user ID
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
  });

});
