import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/domain/error/AppError';
import { HttpStatusCode } from '@/shared/constants/HttpStatusCode';
import { ICreateArticleUseCase, IUpdateArticleUseCase } from '@/application/interfaces/IArticleUseCase';
import { CreateArticleDTO } from '@/application/dto/CreateArticleDTO';
import { MulterDTO } from '@/application/dto/MulterDTO';
import { IUploadImageUseCase } from '@/application/interfaces/IUserUseCase';
import { IGetAllArticleDataUsingFieldUseCase } from '@/application/interfaces/IShowUserArticleUseCase';
import { IUpdateArticleActionUseCase } from '@/application/interfaces/IUpdateArticleActionUseCase';

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
      const userId = req.user.id

      const result = await this.createArticleUseCase.execute(userId, article.title, article.description, article.content, article.category, article.tags, article.image)

      res.json({ status: true, message: 'Article created Successfully' });
    } catch (error: any) {
      console.log("error message", error.message);

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

      res.status(HttpStatusCode.OK).json({ status: true, message: 'image uploaded ', data: url });

    } catch (error) {

      console.log((error));

      next(new AppError('Something went wrong', 500));

    }
  }

  userArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log("userArtile enter");

      const userId = req.user.id
      console.log("userId", userId.toString());

      const articles = await this.getAllArticleDataUsingFieldUseCase.execute({ userId: userId.toString() });

      console.log("articles", articles);

      res.json({ status: true, message: "user articles", data: articles });
    } catch (error) {
      console.log((error));
      next(new AppError('Something went wrong', HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  };




  updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articleId = req.params.id;
      const userId = req.user.id;
      const data = req.body;

      console.log("updating articles", articleId, userId, data);


      const updatedArticle = await this.updateArticleUseCase.execute(articleId, data);
      // if (!updatedArticle) {
      //   return next(new AppError('Article not found', HttpStatusCode.NOT_FOUND));
      // }

      res.json({ status: true, message: 'Article updated successfully', data: updatedArticle });
    } catch (error) {
      console.error(error);
      return next(new AppError('Something went wrong', HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  }


  articleAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { action } = req.body;
      const articleId = req.params.id;
      const userId = req.user.id;
      console.log("article Id",articleId);
      console.log("updating articles", articleId, userId);
      console.log("data action",action);

      const result = await this.updateArticleActionUseCase.execute(userId, articleId, action);


      // if (!result) {
      //   return next(new AppError('Article not found', HttpStatusCode.NOT_FOUND));
      // }

      res.json({ status: true, message: 'Article action updated successfully', data: result });
    } catch (error) {
      console.log((error));
      next(new AppError('Something went wrong', HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  }

}
