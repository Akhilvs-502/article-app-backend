import { Article } from "@/domain/entities/Article";



export interface IShowUserArticleUseCase {
  execute(userId: string): Promise<Article[]>;
}



export interface IGetAllArticleDataUsingFieldUseCase {

    execute(field:Partial<Article>):Promise<Article [] |null>

}
