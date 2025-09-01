import { Article } from "@/domain/entities/Article";
import { BaseRepository } from "./BaseRepository";

import { IArticleRepository } from "@/domain/repositories/IArticleRepository";
import { ArticleModel, IArticle } from "../database/ArticleModel";
import { FilterQuery } from "mongoose";
import { HydratedDocument } from "mongoose";

type ArticleDoc = HydratedDocument<IArticle>;

export class ArticleRepository extends BaseRepository<Article, IArticle> implements IArticleRepository {
    constructor() {
        super(ArticleModel)
    }




    async findAllwithField(field: FilterQuery<Article>): Promise<Article[] | null> {
        const findedDatas = await ArticleModel.find(field).exec()

        return findedDatas
    }

    protected toEntity(data: (IArticle & Document) | null): Article | null {
        if (!data) return null;
        return new Article(data.userId, data.title, data.description, data.content, data.category, data.tags, data.image, data._id, data.likes, data.dislikes, data.createdAt, data.updatedAt, data.isBlocked);
    }

    async getUserFeeds(userId: string,preferences:string[]): Promise<Array<{ article: Article, action: 'like' | 'dislike' | null }>> {
        userId = userId.toString()

        // const preferences = ["tech", "science"];

        const feeds = await ArticleModel.aggregate([
            {
                $lookup: {
                    from: "userarticleactions",
                    let: { articleId: { $toString: "$_id" } }, // convert ObjectId → string
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$articleId", "$$articleId"] },
                                        { $eq: ["$userId", userId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userAction"
                }
            },
            // flatten to single object instead of array
            {
                $addFields: {
                    userAction: { $arrayElemAt: ["$userAction", 0] }
                }
            },
            {
                $addFields: {
                    isLiked: { $eq: ["$userAction.action", "like"] },
                    isDisliked: { $eq: ["$userAction.action", "dislike"] },
                    isBlockedUser: { $eq: ["$userAction.action", "block"] }
                }
            },
            {$match: { isBlocked: false,category:{$in:preferences} }}

        ]);
        return feeds
    }


    async likeArticle(userId: string, articleId: string): Promise<boolean> {
        await ArticleModel.findOneAndUpdate({ _id: articleId }, { $inc: { likes: 1 } })
        return true;

    }

    async unlikeArticle(userId: string, articleId: string): Promise<boolean> {
        await ArticleModel.updateOne({ _id: articleId }, { $inc: { likes: -1 } });
        return true;
    }

    async dislikeArticle(userId: string, articleId: string): Promise<boolean> {
        const result = await ArticleModel.findOneAndUpdate(
            { _id: articleId },
            { $inc: { dislikes: 1 } },

        );
        return !!result;
    }

}