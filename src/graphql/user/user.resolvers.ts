// src/graphql/user/user.resolvers.ts
import { UserModel, User } from '@/src/database/models/user.model'
  
const userResolvers = {
    Query: {
        users: async (): Promise<User[]> => UserModel.find(),
        user: async (_: any, { id }: { id: string }): Promise<User | null> => UserModel.findById(id),
    },
    Mutation: {
        createUser: async (_: any, { input }: { input: User }): Promise<User> => {
            const user = new UserModel(input);
            await user.save();
            return user;
        },
        updateUser: async (_: any, { id, input }: { id: string; input: Partial<User> }): Promise<User | null> => {
            const user = await UserModel.findByIdAndUpdate(id, input, { new: true });
            return user;
        },
        deleteUser: async (_: any, { id }: { id: string }): Promise<User | null> => {
            const user = await UserModel.findByIdAndDelete(id);
            return user;
        },
    },
};

export default userResolvers;
