import bcrypt from "bcrypt";
import validator from "validator";
import { UserRepositories } from "@/src/database/repositories/user.repository";
import { ValidationError } from "@/src/utils/errors/customErrors";
import { ICreateUser, IUpdateUser, User } from "../../database/models/user.model";
import { UserQueryParams } from "@/src/controllers/user.controller";
import { UserService } from "@/src/services/user.service";

// Mock dependencies
jest.mock("@/src/database/repositories/user.repository");
jest.mock("bcrypt");
jest.mock("validator");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepositories>;

  beforeEach(() => {
    userRepository = new UserRepositories() as jest.Mocked<UserRepositories>;
    userService = new UserService();
    userService["userRepository"] = userRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should throw a ValidationError if the password is not strong enough", async () => {
      (validator.isStrongPassword as jest.Mock).mockReturnValue(false);

      const requestBody: ICreateUser = {
        fullName: "John Doe",
        email: "john@example.com",
        password: "weakpassword",
        age: 10,
      };

      await expect(userService.registerUser(requestBody)).rejects.toThrow(
        ValidationError
      );

      expect(validator.isStrongPassword).toHaveBeenCalledWith(
        "weakpassword",
        expect.any(Object)
      );
    });

    it("should call createUser with hashed password", async () => {
      (validator.isStrongPassword as jest.Mock).mockReturnValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
      userRepository.createUser.mockResolvedValue({
        fullName: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
        age: 20,
      });

      const requestBody: ICreateUser = {
        fullName: "John Doe",
        email: "john@example.com",
        password: "StrongPassword123!",
        age: 20,
      };

      const result = await userService.registerUser(requestBody);

      expect(bcrypt.hash).toHaveBeenCalledWith("StrongPassword123!", 10);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        "hashedpassword",
        {
          fullName: "John Doe",
          email: "john@example.com",
          password: "StrongPassword123!",
          age: 20,
        }
      );
      expect(result).toEqual({
        fullName: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
        age: 20,
      });
    });
  });

  describe("getAllUsers", () => {
    it("should call userRepository.getAllUsers with correct pagination", async () => {
      const query: UserQueryParams = { page: 1, limit: 10 };
      userRepository.getAllUsers.mockResolvedValue({
        users: [],
        totalUser: 0,
        totalPages: 0,
      });

      const result = await userService.getAllUsers(query);

      expect(userRepository.getAllUsers).toHaveBeenCalledWith(query);
      expect(result).toEqual({
        users: [],
        totalUser: 0,
        totalPages: 0,
        page: 1,
      });
    });
  });

  describe("updateUser", () => {
    it("should call userRepository.updateUser with correct id and data", async () => {
      const id = "user-id";
      const updateData: IUpdateUser = {
        fullName: "John Doe Updated",
        email: "john.updated@example.com",
      };
      const updatedUser: { message: string; data: User } = {
        message: "User updated successfully",
        data: {
          fullName: "John Doe Updated",
          email: "john.updated@example.com",
          password: "hashedpassword",
          age: 30,
          status: "active",
          role: "user",
        },
      };

      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(id, updateData);

      expect(userRepository.updateUser).toHaveBeenCalledWith(id, updateData);
      expect(result).toEqual(updatedUser);
    });
  });

  describe("deleteUser", () => {
    it("should call userRepository.deleteUser with correct id", async () => {
      const id = "user-id";
      userRepository.deleteUser.mockResolvedValue({
        message: "User deleted successfully",
      });

      const result = await userService.deleteUser(id);

      expect(userRepository.deleteUser).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        message: "User deleted successfully",
      });
    });
  });
});
