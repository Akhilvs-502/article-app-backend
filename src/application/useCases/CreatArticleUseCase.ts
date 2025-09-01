import { IArticleRepository } from "@/domain/repositories/IArticleRepository";
import { ICreateArticleUseCase } from "../interfaces/IArticleUseCase";
import { Article } from "@/domain/entities/Article";




export class CreateArticleUseCase implements ICreateArticleUseCase {
    constructor(
        private articleRepository: IArticleRepository

    ) {
    }

    async execute(userId:string,title: string, description: string, content: string, category: string, tags: string[], image: string): Promise<Article> {
        const article = await this.articleRepository.create({
            userId,
            title,
            description,
            content,
            category,
            tags,
            image
        });

        return article;
    }
}