


export interface IUpdatePreferencesUseCase{

    execute(email:string,preferences:string):Promise<void>

}