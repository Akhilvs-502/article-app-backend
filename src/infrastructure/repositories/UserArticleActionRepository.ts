import { IUserArticleActionRepository } from '@/domain/repositories/IUserArticleActionRepository';
import { UserArticleActionModel } from '../database/UserArticleActionModel';

export class UserArticleActionRepository implements IUserArticleActionRepository {

async findOne(userId: string, articleId: string): Promise<any> {
    return await UserArticleActionModel.findOne({ userId, articleId });
     
  }



  async likeArticle(userId: string, articleId: string): Promise<boolean> {
    
    const result = await UserArticleActionModel.findOneAndUpdate(
      { userId, articleId },
      { action: 'like' },
      { new: true, upsert: true }
    );
    return !!result;
  }

  async unlikeArticle(userId: string, articleId: string): Promise<boolean> {
    const result = await UserArticleActionModel.deleteOne({ userId, articleId });
    return result.deletedCount > 0;
  }

  async dislikeArticle(userId: string, articleId: string): Promise<boolean> {
    const result = await UserArticleActionModel.findOneAndUpdate(
      { userId, articleId },
      { action: 'dislike' },
      { new: true, upsert: true }
    );
    return !!result;
  }

  async blockArticle(userId: string, articleId: string): Promise<void> {
      await UserArticleActionModel.findOneAndUpdate(
      { userId, articleId },
      { action: 'block' },
      { new: true, upsert: true }
    );
  }
}
