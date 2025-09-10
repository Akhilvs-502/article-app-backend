import { ArticleRepository } from '@/infrastructure/repositories/ArticleRepository';
import { IUpdateArticleActionUseCase } from '../interfaces/IUpdateArticleActionUseCase';
import { UserArticleActionRepository } from '@/infrastructure/repositories/UserArticleActionRepository';
import { log } from 'console';

export class UpdateArticleActionUseCase implements IUpdateArticleActionUseCase {
    constructor(
        private userArticleActionRepository: UserArticleActionRepository,
        private articleRepository: ArticleRepository

    ) { }



    async execute(userId: string, articleId: string, action: 'like' | 'removeLike' | 'dislike' | 'removeDislike' | 'block'): Promise<void> {

        console.log("in use case",action);

        const currentData = await this.userArticleActionRepository.findOne(userId, articleId)
console.log("current data",currentData);

        switch (action) {

            case 'like':
                if (currentData?.action == 'dislike') {
                    await this.articleRepository.removeDislikeArticle(userId, articleId);
                }
                if(currentData?.action == 'like'){
                    await this.articleRepository.removeLikeArticle(userId, articleId);
                    await this.userArticleActionRepository.unlikeArticle(userId, articleId);
                    return;
                }
                if(!currentData || currentData?.action!=="like"){
                    await this.userArticleActionRepository.likeArticle(userId, articleId);
                    await this.articleRepository.likeArticle(userId, articleId);
                }
                break;
            case 'dislike':
                if (currentData?.action == 'like') {
                    await this.articleRepository.removeLikeArticle(userId, articleId);
                }
                if(currentData?.action == 'dislike'){
                    await this.articleRepository.removeDislikeArticle(userId, articleId);
                    await this.userArticleActionRepository.unlikeArticle(userId, articleId);
                    return;
                }
                if(currentData || currentData.action!="dislike"){

                    await this.userArticleActionRepository.dislikeArticle(userId, articleId);
                    await this.articleRepository.disLikeArticle(userId, articleId);
                    break;   
                }
                break;
            case 'block':
                await this.userArticleActionRepository.blockArticle(userId, articleId);
                // await this.articleRepository.blockArticle(userId, articleId);
                break;
        }

        return;
    }



}