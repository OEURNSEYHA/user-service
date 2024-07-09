import { UserRepositories } from '@/src/database/repositories/user.repository'; // Adjust the path to your UserRepository
import bcrypt from 'bcrypt';
import validator from 'validator';
import { NotFoundError, ValidationError } from '@/src/utils/errors/customErrors'; // Adjust the path to your custom ValidationError
import { ICreateUser, IUpdateUser, User } from '../database/models/user.model';
import { UserQueryParams } from '../controllers/user.controller';
// import { UserModel, User } from '../database/models/user.model';
//===========================================


export class UserService {
  private userRepository: UserRepositories;
  constructor() {
    this.userRepository = new UserRepositories();
  }
  // register service
  public async registerUser(requestBody: ICreateUser) {
    // Validate password strength
    if (!validator.isStrongPassword(requestBody.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) throw new ValidationError('Password is not strong enough');

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);
    // Call the repository to save the user
    return await this.userRepository.createUser(hashedPassword, requestBody);
  }


  // get all users service
  public async getAllUsers(query: UserQueryParams) {
    // const page = query.page ? Number(query.page) : 1;
    // const limit = query.limit ? Number(query.limit) : 10;
    const result = await this.userRepository.getAllUsers(query);
    return {
      users: result.users,
      totalUser: result.totalUser,
      totalPages: result.totalPages,
      page : query.page
    };
    
  }

  // get one user service
  public async getOneUsers(id: string) {
    const result = await this.userRepository.getOneUsers(id);
    return result;
  }

  // update user service
  // public async updateUser(id: string, requestBody:IUpdateUser) {
  //   const result = await this.userRepository.updateUser(id, requestBody);
  //   return result;
  // }

  public async updateUser(id: string, requestBody: IUpdateUser): Promise<{ message: string, data: User | null }> {
    try {
         const result = await this.userRepository.updateUser(id, requestBody);

      if (!result) {
        throw new NotFoundError('User not found');
      }
      
      return result;
    } catch (error) {
      console.error("Service error updating user:", error);
      throw error;
    }
  }

  // delete user service

  public async deleteUser(id: string) {
    const result = await this.userRepository.deleteUser(id);
    return result;
  }




}
