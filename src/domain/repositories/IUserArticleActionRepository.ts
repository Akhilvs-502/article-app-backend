export interface IUserArticleActionRepository {
  likeArticle(userId: string, articleId: string): Promise<boolean>;
  unlikeArticle(userId: string, articleId: string): Promise<boolean>;
  dislikeArticle(userId: string, articleId: string): Promise<boolean>;
  blockArticle(userId: string, articleId: string): Promise<void>;
}
