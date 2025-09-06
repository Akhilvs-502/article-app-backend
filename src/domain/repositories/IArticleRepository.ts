
import { FilterQuery } from "mongoose";
import { Article } from "../entities/Article";
import { IBaseRepository } from "./IBaseRepository";



export interface IArticleRepository extends IBaseRepository<Article> {
    findAllwithField(field: FilterQuery<Article>): Promise<Article[] | null>;
    likeArticle(userId: string, articleId: string): Promise<boolean>;
    removeLikeArticle(userId: string, articleId: string): Promise<boolean>;
    disLikeArticle(userId: string, articleId: string): Promise<boolean>;
    removeDislikeArticle(userId: string, articleId: string): Promise<boolean>;


}
export interface IArticleActionRepository {

    getUserFeeds(userId: string, preferences: string[]): Promise<Array<Article&{ isLiked: boolean, isDisliked: boolean, isBlockedUser: boolean }>>


}