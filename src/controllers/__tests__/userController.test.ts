import request from 'supertest';
import express, { Express } from 'express';
import { RegisterRoutes } from '@/src/routes/v1/routes'; // Adjust the path as needed
import { UserService } from '@/src/services/user.service';
import {  UserModel, User } from '@/src/database/models/user.model';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
const app: Express = express();
app.use(express.json());

RegisterRoutes(app);

describe('UsersController', () => {
  // describe('GET /api/v1/users', () => {
  //   it('should return all users', async () => {
  //     const mockUsers: User[] = [
  //       {  fullName: 'John Doe', email: 'john@example.com', password: 'hashedpassword', age: 30, status: 'active', role: 'user' },
  //       {  fullName: 'Jane Doe', email: 'jane@example.com', password: 'hashedpassword', age: 25, status: 'active', role: 'admin' },
  //     ];
  //     jest.spyOn(UserService.prototype, 'getAllUsers').mockResolvedValue({
  //       users: mockUsers,
  //       totalUser: 2,
  //       totalPages: 1,
  //       page:1
  //     });

  //     const response = await request(app).get('/api/v1/users');
  //     expect(response.status).toBe(200);
  //     expect(response.body.users).toEqual(mockUsers);
  //     expect(response.body.totalUser).toBe(2);
  //     expect(response.body.totalPages).toBe(1);
  //   });
  // });

  describe('GET /api/v1/users/:id', () => {
    it('should return a single user by ID', async () => {
      const mockUser: User = {  fullName: 'John Doe', email: 'john@example.com', password: 'hashedpassword', age: 30, status: 'active', role: 'user' };
      jest.spyOn(UserService.prototype, 'getOneUsers').mockResolvedValue(mockUser);

      const response = await request(app).get('/api/v1/users/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });

  // describe('POST /api/v1/users', () => {
  //   it('should create a new user', async () => {
  //     const newUser = { fullName: 'John Doe', email: 'john@example.com', password: 'password123', age: 30};
  //     const savedUser = { ...newUser, id: '1' };
  //     jest.spyOn(UserService.prototype, 'registerUser').mockResolvedValue(savedUser);
  
  //     const response = await request(app).post('/api/v1/users').send(newUser);
  //     if (response.status !== 200) {
  //       console.log("Response Body:", response.body); // Add this line
  //     }
  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual(savedUser);
  //   });
  // });

describe('PUT /api/v1/users/:id', () => {
  it('should update a user', async () => {
    const updateUser = { fullName: 'John Doe Updated', email: 'john_updated@example.com', password: "seyha*999", age: 31, status: 'inactive', role: 'user' };
    const updatedUser = { ...updateUser};
    jest.spyOn(UserService.prototype, 'updateUser').mockResolvedValue({ message: 'User updated', data: updatedUser });

    const response = await request(app).put('/api/v1/users/1').send(updateUser);
    if (response.status !== 200) {
      console.log("Response Body:", response.body);
      console.log("Response Status:", response.status);
    }
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User updated', data: updatedUser });
  });
});
  
  describe('DELETE /api/v1/users/:id', () => {
    it('should delete a user', async () => {
      jest.spyOn(UserService.prototype, 'deleteUser').mockResolvedValue({ message: 'User deleted' });

      const response = await request(app).delete('/api/v1/users/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted' });
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should login a user', async () => {
      const loginData = { email: 'john@example.com', password: 'password123' };
      const findUser = { email: 'john@example.com', password: 'hashedpassword', fullName: 'John Doe', age: 30, status: 'active', role: 'user' };
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(findUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(jwt, 'sign').mockImplementation(() => 'jwt_token');

      const response = await request(app).post('/api/v1/users/login').send(loginData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Login successful', token: 'jwt_token' });
    });
  });
});
