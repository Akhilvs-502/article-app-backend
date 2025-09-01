import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { IUpdatePreferencesUseCase } from "../interfaces/IUpdatePreferencesUseCase";




export class UpdatePreferencesUseCase implements IUpdatePreferencesUseCase{

constructor(
        private userRepository: IUserRepository,
    
){}


    async execute(email:string,preferences:string):Promise<void>{
        this.userRepository.updateFieldsByEmail(email,preferences)
    }

}