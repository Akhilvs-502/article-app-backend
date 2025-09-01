import { ArticleRepository } from '@/infrastructure/repositories/ArticleRepository';
import { IUpdateArticleActionUseCase } from '../interfaces/IUpdateArticleActionUseCase';
import { UserArticleActionRepository } from '@/infrastructure/repositories/UserArticleActionRepository';

export class UpdateArticleActionUseCase implements IUpdateArticleActionUseCase {
    constructor(
        private userArticleActionRepository: UserArticleActionRepository,
        private articleRepository: ArticleRepository

    ) {}

 

    async execute(userId: string, articleId: string, action: 'like' | 'unlike' | 'dislike' | 'block'): Promise<void> {
        
        console.log(action);

        
        switch (action) {
            
            case 'like':
                await this.userArticleActionRepository.likeArticle(userId, articleId);
                await this.articleRepository.likeArticle(userId, articleId);
                break;
            case 'unlike':
              const unlike=await this.userArticleActionRepository.unlikeArticle(userId, articleId);
                if(unlike)
                await this.articleRepository.unlikeArticle(userId, articleId);          
                break;
            case 'dislike':
                await this.userArticleActionRepository.dislikeArticle(userId, articleId);
                await this.articleRepository.dislikeArticle(userId, articleId); 
                break;
            case 'block':
                await this.userArticleActionRepository.blockArticle(userId, articleId);
                // await this.articleRepository.blockArticle(userId, articleId);
                break;
        }

        return;
    }



}