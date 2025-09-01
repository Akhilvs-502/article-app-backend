
import { FilterQuery } from "mongoose";
import { Article } from "../entities/Article";
import { IBaseRepository } from "./IBaseRepository";



export interface IArticleRepository extends IBaseRepository<Article>{
    findAllwithField(field: FilterQuery<Article>): Promise<Article[] | null>;
}
export interface IArticleActionRepository {
 
}