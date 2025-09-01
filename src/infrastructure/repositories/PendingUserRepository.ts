import { Document } from 'mongoose';
import { PendingUser } from '@/domain/entities/PendingUser'; 
import { IPendingUserRepository } from '@/domain/repositories/IPendingUserRepository';
import { IPendingUser, PendingUserModel } from '@/infrastructure/database/PendingUser';
import { BaseRepository } from './BaseRepository';

export class PendingUserRepository extends BaseRepository<PendingUser, IPendingUser> implements IPendingUserRepository {
  constructor() {
    super(PendingUserModel);
  }

  async updateOtp(email:string, temUser: string):Promise<void> {
    await PendingUserModel.findOneAndUpdate({ email }, { otp: temUser, createdAt: new Date() });
  }

  async findValidUser(email: string): Promise<PendingUser | null> {
    const found = await PendingUserModel.findOne({ email });
    console.log(found, 'data in pendn userModel');

    if (!found) return null;
    return this.toEntity(found);
    // return new temUser(found.name,found.email,found.password,found.createdAt,found.otp)
  }

  async delete(email: string): Promise<void> {
    await PendingUserModel.deleteOne({ email });
  }

  protected toEntity(data: (IPendingUser & Document) | null): PendingUser | null {
    if (!data) return null;
    return new PendingUser(data.firstName,data.lastName, data.email, data.password, data.createdAt, data.otp);
  }
}
