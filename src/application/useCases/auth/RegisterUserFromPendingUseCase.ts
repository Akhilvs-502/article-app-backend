import { User } from '@/domain/entities/User';
import { IPendingUserRepository } from '@/domain/repositories/IPendingUserRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IRegisterUserFromPendingUseCase } from '@/application/interfaces/IUserUseCase';
import { UserMapper } from '@/application/mapper/UserMapper';

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export class RegisterUserFromPendingUseCase implements IRegisterUserFromPendingUseCase {
  constructor(
        private pendingUserRepository: IPendingUserRepository,
        private UserRepository: IUserRepository,
  ) { }

  async execute(email: string): Promise<User | null> {
    const pendingUser = await this.pendingUserRepository.findValidUser(email);
    if (!pendingUser) {
      throw new Error('User not found in pending list');
    }
    const existingEmail = await this.UserRepository.findByEmail(email);

    if (existingEmail) {
      throw new Error('User with this email already exists');
    }

    console.log("creating new user..............",email);
    
    const user = await this.UserRepository.create({
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      email: pendingUser.email,
      password: pendingUser.password,
    } as any);

    return UserMapper.toResponseDTO(user);
  }
}
