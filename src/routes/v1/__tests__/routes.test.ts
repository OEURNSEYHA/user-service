import request from 'supertest';
import app from '@/src/app';  // Ensure correct path to the app

let userId: string;

describe('Users API', () => {
  it('should create a new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      age: 30,
    });
    expect(response.status).toBe(200);  // Adjust based on your implementation
    expect(response.body).toHaveProperty('id');
    userId = response.body.id;
  });

  it('should get all users', async () => {
    const response = await request(app).get('/api/v1/users');
    expect(response.status).toBe(200);  // Adjust based on your implementation
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get a user by ID', async () => {
    const response = await request(app).get(`/api/v1/users/${userId}`);
    expect(response.status).toBe(200);  // Adjust based on your implementation
    expect(response.body).toHaveProperty('id', userId);
  });

  it('should update a user by ID', async () => {
    const response = await request(app).put(`/api/v1/users/${userId}`).send({
      name: 'John Doe Updated',
      age: 31,
    });
    expect(response.status).toBe(200);  // Adjust based on your implementation
    expect(response.body).toHaveProperty('id', userId);
  });

  it('should delete a user by ID', async () => {
    const response = await request(app).delete(`/api/v1/users/${userId}`);
    expect(response.status).toBe(200);  // Adjust based on your implementation
  });

  it('should login a user', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: 'john@example.com',
      password: 'password123',
    });
    expect(response.status).toBe(200);  // Adjust based on your implementation
    expect(response.body).toHaveProperty('token');
  });
});
