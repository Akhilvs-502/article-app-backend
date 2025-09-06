import { NextFunction, Request, Response } from 'express';
import { UpdateArticleActionUseCase } from '@/application/useCases/UpdateArticleActionUseCase';
import { ArticleRepository } from '@/infrastructure/repositories/ArticleRepository';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ControllerMessages } from '@/shared/constants/ControllerMessages';
import { IGetFeedUseCase } from '@/application/interfaces/IUserUseCase';

export class ArticleController {
    constructor(
        private feedUseCase: IGetFeedUseCase
    ) { }

    getFeeds = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const feeds = await this.feedUseCase.execute(req.user?.id!)
            
            res.json({ status: true, message: ControllerMessages.ARTICLE_FETCHED, data: feeds });

        } catch (error) {
            
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ControllerMessages.INTERNAL_SERVER_ERROR });
        }
    }
}

