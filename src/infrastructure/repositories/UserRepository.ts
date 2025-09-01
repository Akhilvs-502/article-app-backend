import { Document } from 'mongoose';
import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository'
import UserModel, { IUser } from '../database/UserModel';
import { BaseRepository } from './BaseRepository';


export class UserRepository extends BaseRepository<User, IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const getUser = await UserModel.findOne({ email }).lean();
    if (!getUser) return null;
    return this.toEntity(getUser);
  }

  async findByUserName(name: string): Promise<User | null> {
    const getUser = await UserModel.findOne({ name }).lean();
    if (!getUser) return null;
    return this.toEntity(getUser);
  }

  async updatePassword(email: string, password: string): Promise<User | null> {
    const updateUser = await UserModel.findOneAndUpdate({ email }, { password });
    if (!updateUser) return null;
    return this.toEntity(updateUser);
  }

  async updateFieldsByEmail(email: string, fieldsToUpdate: Partial<User>): Promise<User | null> {
    const updateUser = await UserModel.findOneAndUpdate({ email }, { $set: fieldsToUpdate }, { new: true }).lean();
    if (!updateUser) return null;
    return this.toEntity(updateUser);
  }

  protected toEntity(data: (IUser & Document<unknown>) | null): User | null {
    if (!data) return null;

    return new User(
      data.firstName,
      data.lastName,
      data.email,
      data.preferences,
      data.image,
      data.bio,
      data.createdAt,
      data.status,
      data._id,
      data.password,
      data.updatedAt,
      data.dateOfBirth,
      data?.googleId,
    );
  }
}
