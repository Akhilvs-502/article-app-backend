import { IArticleRepository } from "@/domain/repositories/IArticleRepository";
import { IShowUserArticleUseCase } from "../interfaces/IShowUserArticleUseCase";
import { Article } from "@/domain/entities/Article";





export class ShowUserArticleUseCase  implements IShowUserArticleUseCase{
  constructor(private articleRepository: IArticleRepository) {}

  async execute(userId: string): Promise<Article[] > {
    const articles = await this.articleRepository.findAllwithField(userId);
    if(!articles) return []
    return articles

  }
}