import { User } from "../entities/User";
import { IBaseRepository } from "./IBaseRepository";




export interface IUserRepository extends IBaseRepository<User> {

  findByEmail(email: string): Promise<User | null>;

  findByUserName(name: string): Promise<User | null>

  updatePassword(email: string, password: string): Promise<User | null>

  updateFieldsByEmail(email: string, fieldsToUpdate: Partial<User>): Promise<User | null>


}

export interface IAuthRepository {
  login(email: string, password: string): Promise<{ token: string, user: User }>
  logout(userId: string): Promise<void>
  verifyToken(token: string): Promise<User | null>
}
