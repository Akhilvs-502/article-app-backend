import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { IHashAlgorithm } from '@/domain/services/IHashAlgorithm';
import { IPendingUserRepository } from '@/domain/repositories/IPendingUserRepository';

import { ICreateUserUseCase } from '@/application/interfaces/IUserUseCase';

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashAlgorithm,
    private pendingUserRepository:IPendingUserRepository,
  ) {}

  async execute(firstName: string,lastName:string, email: string, password: string): Promise<string| null > {
    const existingEmail = await this.userRepository.findByEmail(email);
 
    if (existingEmail) {
      throw new Error('User with this email already exists');
    }
    const hashedPassword = await this.hashService.hash(password); // IS HERE WANTED TRY CATCH
    const user = new User(firstName,lastName, email,[],hashedPassword);

    console.log("user",user );
    
    const createdUserEmail = await this.pendingUserRepository.create({ firstName: user.firstName,lastName:user.lastName, email: user.email, password: hashedPassword });
    console.log("created user",createdUserEmail);
    
    if (!createdUserEmail) return null;
    return createdUserEmail.email;
  }
}
