import { Article } from "@/domain/entities/Article";


export interface ICreateArticleUseCase{
    execute(userId:string,title:string,description:string,content:string,category:string,tags:string[],image:string):Promise<Article>
}


export interface IUpdateArticleUseCase {
    execute(articleId: string, data: Partial<Article>): Promise<Article | null>;
}