import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id:Types.ObjectId
    firstName:string;
    lastName:string;
    email:string;
    phone:string
    password:string;
    image:string;
    bio:string;
    github:string
    status:string
    googleId:string;
    createdAt:Date;
    updatedAt:Date;
    dateOfBirth:string
    preferences:string[]
}

const UserSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,

  },
  lastName: {
    type: String,
    required: true,
 
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  preferences:{type:[String]},

  phone: { type: String },

  dateOfBirth: { type: String },

  password: { type: String, required: true },

  image: { type: String, // default:"https://images.app.goo.gl/WxwYnYXooctTp8sX7"
  },
  bio: { type: String },

  github: { type: String },

  googleId: {
    type: String,
  },
  status: {
    type: String,
    default: 'active',
  }

}, { timestamps: true });

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
