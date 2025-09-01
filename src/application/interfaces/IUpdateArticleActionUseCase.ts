export interface IUpdateArticleActionUseCase {
  execute(userId: string, articleId: string, action: 'like' | 'unlike' | 'dislike' | 'block'): Promise<void>;
}
