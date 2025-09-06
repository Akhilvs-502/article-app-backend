import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/domain/error/AppError';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';
import { ICreateArticleUseCase, IUpdateArticleUseCase } from '@/application/interfaces/IArticleUseCase';
import { CreateArticleDTO } from '@/application/dto/CreateArticleDTO';
import { MulterDTO } from '@/application/dto/MulterDTO';
import { IUploadImageUseCase } from '@/application/interfaces/IUserUseCase';
import { IGetAllArticleDataUsingFieldUseCase } from '@/application/interfaces/IShowUserArticleUseCase';
import { IUpdateArticleActionUseCase } from '@/application/interfaces/IUpdateArticleActionUseCase';
import { ControllerMessages } from '@/shared/constants/ControllerMessages';

export class DashboardController {
  constructor(
    private createArticleUseCase: ICreateArticleUseCase,
    private uploadImageUseCase: IUploadImageUseCase,
    private getAllArticleDataUsingFieldUseCase: IGetAllArticleDataUsingFieldUseCase,
    private updateArticleActionUseCase: IUpdateArticleActionUseCase,
    private updateArticleUseCase: IUpdateArticleUseCase
  ) { }

  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('create article');

      const article = new CreateArticleDTO(req.body)
      const user = req.user

      const result = await this.createArticleUseCase.execute(user?.id!, article.title, article.description, article.content, article.category, article.tags, article.image)

      res.json({ status: true, message: ControllerMessages.ARTICLE_CREATED_SUCCESS, data: result });
    } catch (error: any) {

      next(new AppError(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR));


    }
  };

  imageUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const file = req.file as Express.Multer.File

      // console.log("image uploading....",file);
      const fileData = new MulterDTO(file)



      const url = await this.uploadImageUseCase.execute(fileData.buffer, fileData.originalName, fileData.mimetype)
      console.log("image url", url);

      res.status(HttpStatusCode.OK).json({ status: true, message: ControllerMessages.IMAGE_UPLOADED, data: url });

    } catch (error) {

      console.log((error));

      next(new AppError('Something went wrong', 500));

    }
  }

  userArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const user = req.user
      console.log("userId", user?.id!.toString());

      const articles = await this.getAllArticleDataUsingFieldUseCase.execute({ userId: user?.id!.toString() });

      res.json({ status: true, message: ControllerMessages.USER_ARTICLES, data: articles });
    } catch (error) {
      console.log((error));
      next(new AppError('Something went wrong', HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  };




  updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articleId = req.params.id;
      const user = req.user;
      const data = req.body;

      console.log("updating articles", articleId, user?.id, data);


      const updatedArticle = await this.updateArticleUseCase.execute(articleId, data);
      // if (!updatedArticle) {
      //   return next(new AppError('Article not found', HttpStatusCode.NOT_FOUND));
      // }

      res.json({ status: true, message: ControllerMessages.ARTICLE_UPDATED_SUCCESS, data: updatedArticle });
    } catch (error) {
      console.error(error);
      return next(new AppError('Something went wrong', HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  }


  articleAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { action } = req.body;
      const articleId = req.params.id;
      const user = req.user;
  

      const result = await this.updateArticleActionUseCase.execute(user?.id!, articleId, action);

      res.json({ status: true, message: ControllerMessages.ARTICLE_ACTION_UPDATED_SUCCESS, data: result });
    } catch (error) {
      console.log((error));
      next(new AppError('Something went wrong', HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  }

}
