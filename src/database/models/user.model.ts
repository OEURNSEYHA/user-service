
import { Schema, model } from "mongoose";
import validator from "validator";

export interface User {
  fullName: string;
  email: string;
  password: string;
  age: number;
  status: string;
  role: string; 
}

export interface IUpdateUser {
  fullName?: string;
  email?: string;
  password?: string;
  age?: number;
  status?: string;
  role?: string; // Add role to User interface
}



export interface ICreateUser {
  fullName: string;
  email: string;
  password: string;
  age: number;
}

// export interface UserDocument extends User, Document { }

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: (props: { value: string }) => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true,
    // validate: {
    //   validator: (value: string) => validator.isStrongPassword(value),
    //   message: (_props: { value: string }) => 'Password is not strong enough!'
    // }
  },
  age: {
    type: Number,
    require: true
  },
  status: { type: String, default: 'active' },
  role: { type: String, required: true, default: "user" } // Add role to schema
});

// export const UserModel = model('User', UserSchema);
export const UserModel = model<User>('User', UserSchema);
