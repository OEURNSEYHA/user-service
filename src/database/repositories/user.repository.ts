import { UserQueryParams } from '@/src/controllers/user.controller';
import { UserModel, User, ICreateUser, IUpdateUser } from '@/src/database/models/user.model'; // Adjust the path to your User model
// ===========================================

export class UserRepositories {
  // createuser repository
  public async createUser(hashedPassword: string, requestBody: ICreateUser): Promise<ICreateUser> {
    const { fullName, email, age } = requestBody;
    // Create a new user document using the provided parameters
    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword, // Save the hashed password
      age
    });
    // Save the new user to the database
    const savedUser = await newUser.save();
    return savedUser;
  }

  // Get all user repository
  public async getAllUsers(query: UserQueryParams): Promise<{ users: User[], totalUser: number, totalPages: number }> {
    // const sortOrder = query.age === 'asc' ? 1 : -1; // Default to descending if not specified

    // Construct the sort object based on query parameters
    const sortOptions: { [key: string]: 1 | -1 } = {};
    // Construct the filter object based on query parameters
    if (query.fullName) {
      sortOptions.fullName = query.fullName === 'asc' ? 1 : -1;
    }

    if (query.age) {
      sortOptions.age = query.age === 'asc' ? 1 : -1;
    }

    const filter: any = {};
    if (query.status) {
      filter.status = { $regex: new RegExp(query.status, 'i') };
    }

    if (query.ageMin !== undefined && query.ageMax !== undefined) {
      filter.age = { $gte: query.ageMin, $lte: query.ageMax };
    }

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const totalUser = await UserModel.countDocuments();
    const totalPages = Math.ceil(totalUser / limit);
    const users = await UserModel.find(filter).skip((page - 1) * limit).limit(limit).sort(sortOptions)
    return { users, totalUser, totalPages };

  }

  // Get one user repository
  public async getOneUsers(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).exec();
    return user;
  }

  // Update user
  public async updateUser(
    id: string,
    requestBody: IUpdateUser
  ): Promise<{ message: string, data: User | null }> {
    const updatedUser = await UserModel.findByIdAndUpdate(id, requestBody, { new: true });
    return { message: "update successfully", data: updatedUser };

  }

  // Delete user
  public async deleteUser(
    id: string
  ) {
    await UserModel.findByIdAndDelete(id);
    return { message: "delete successfully" }
  }


  // public async deleteUser(id: string)

}
