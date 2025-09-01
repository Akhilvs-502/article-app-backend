import { NextFunction, Request, Response } from 'express';
import { UpdateArticleActionUseCase } from '@/application/useCases/UpdateArticleActionUseCase';
import { ArticleRepository } from '@/infrastructure/repositories/ArticleRepository';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

export class ArticleController {
    constructor(private articleRepository: ArticleRepository,
        private userRepository: IUserRepository
    ) { }

    getFeeds = async (req: Request, res: Response, next: NextFunction) => {
        try {

            console.log("fetching.........data");

            // const userId=req.user as 
            const user=req.user as { id: string };
            const userData=await this.userRepository.findById(user.id);
            const feeds = await this.articleRepository.getUserFeeds(user.id,userData?.preferences || [] );

            // console.log(feeds);

            res.json({ status: true, message: 'Article fetched successfully', data: feeds });

        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }
}

