import {
  Controller,
  Route,
  Post,
  Body,
  Get,
  Path,
  Queries,
  Request,
  // Middlewares,
  Put,
  Delete,
  Tags,
 
} from "tsoa";
import { UserModel, User, ICreateUser, IUpdateUser } from "@/src/database/models/user.model";
import { Request as ExpressRequest } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

import {
  NotFoundError,
  ValidationError,
} from "@/src/utils/errors/customErrors";
import { ReasonPhrases } from "@/src/utils/constands/satusCodes";
import { UserService } from "../services/user.service";
// import {  authorizeUser } from "../middlewares/authRequire";

export interface UserQueryParams {
  page?: number | undefined;
  limit?: number | undefined;
  age?: 'asc' | 'desc';
  fullName?: 'asc' | 'desc';
  ageMin?: number;
  ageMax?: number;
  status?: string;
}




@Tags("users")
@Route("api/v1/users")
export class UsersController extends Controller {
  // private userService: UserService = new UserService();
  private readonly userService: UserService;
  constructor() {
    super();
    this.userService = new UserService();
  }

  // get all user
  @Get()
  // @Middlewares([authorizeUser])
  async getAllUser(
    @Queries() query: UserQueryParams = { page: 1, limit: 10 }
  ): Promise<{ users: User[], totalUser: number, totalPages: number, }> {
    try {
      const result = await this.userService.getAllUsers(query);
      return result;

    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${error.message}`
      );
    }
  }

  // get one user
  @Get("{id}")
  // @Middlewares(authorizeUser)
  public async getUser(@Path() id: string): Promise<User | null> {
    try {
      const result = await this.userService.getOneUsers(id);
      return result;
    } catch (error: any) {
      throw new Error(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${error.message}`
      );
    }
  }

  // update user;
  @Put("{id}")
  // @Middlewares([authorizeUser, authorizeRoles("admin")])
  public async updateUser(
    @Path() id: string,
    @Body() requestBody: IUpdateUser
  ): Promise<{ message: string, data: User | null }> {
    try {

      const result = await this.userService.updateUser(
        id,
        requestBody
      );
      return result;
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      this.setStatus(500);
      return { message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: null };
    }
  }

  // delete user
  @Delete("{id}")
  public async deleteUser(@Path() id: string): Promise<any> {
    try {
      const result = await this.userService.deleteUser(id);
      return result;
    } catch (error: any) {
      throw new Error(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${error.message}`
      );
    }
  }

  // register new user;
  @Post("/")
  public async createUser(
    @Body() requestBody: ICreateUser
  ): Promise<any> {
    try {
      const savedUser = await this.userService.registerUser(
        requestBody
      );
      return savedUser;
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${error.message}`
      );
    }
  }

  // login
  @Post("login")
  public async login(
    @Body() requestBody: { email: string; password: string },
    @Request() request: ExpressRequest
  ): Promise<any> {
    const response = request.res!;
    try {
      const { email, password } = requestBody;
     
      // Find user by email
      const findUser = await UserModel.findOne({ email });
      if (!findUser) {
        response.status(404).json({ error: "User not found" });
        return;
      }

      // Validate password
      const isPasswordMatch = await bcrypt.compare(password, findUser.password);
      if (!isPasswordMatch) {
        response.status(401).json({ error: 'Invalid password' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { _id: findUser._id, email: findUser.email },
        process.env.SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
      );

      // Set cookie with the JWT token
      response.cookie("token", token, {
        // httpOnly: true,
        // secure: true, // Enable in production (requires HTTPS)
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true, // Make sure to set this for HTTPS
        path: "/",
        // sameSite: "None", // Recommended for added security
      });

      response.json({ message: "Login successful", token });
    } catch (error) {
      throw error;
      // response.status(500).json({ error: 'Internal server error' });
    }
  }
}

