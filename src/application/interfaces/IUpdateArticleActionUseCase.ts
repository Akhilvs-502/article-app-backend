export interface IUpdateArticleActionUseCase {
     execute(userId: string, articleId: string, action: 'like' | 'removeLike' | 'dislike' | 'removeDislike' | 'block'): Promise<void> 

}
