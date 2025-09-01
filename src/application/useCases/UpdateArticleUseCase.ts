import { Article } from "@/domain/entities/Article";
import { IArticleRepository } from "@/domain/repositories/IArticleRepository";
import { IUpdateArticleUseCase } from "../interfaces/IArticleUseCase";


export class UpdateArticleUseCase implements IUpdateArticleUseCase {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(articleId: string, data: Partial<Article>): Promise<Article | null> {
    const updatedArticle = await this.articleRepository.updateOneById(articleId, data);
    return updatedArticle;
  }
}