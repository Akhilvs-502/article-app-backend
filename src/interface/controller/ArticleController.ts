import { NextFunction, Request, Response } from 'express';
import { UpdateArticleActionUseCase } from '@/application/useCases/UpdateArticleActionUseCase';
import { ArticleRepository } from '@/infrastructure/repositories/ArticleRepository';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';

export class ArticleController {
    constructor(private articleRepository: ArticleRepository) { }

    getFeeds = async (req: Request, res: Response, next: NextFunction) => {
        try {

            console.log("fetching.........data");
            
            const feeds = await this.articleRepository.getUserFeeds(req.user.id);

            // console.log(feeds);

            res.json({ status: true, message: 'Article fetched successfully', data: feeds });

        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }
}

