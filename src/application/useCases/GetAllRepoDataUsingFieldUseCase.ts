import { Article } from '@/domain/entities/Article';
import { IArticleRepository } from '@/domain/repositories/IArticleRepository';
import { IGetAllArticleDataUsingFieldUseCase } from '../interfaces/IShowUserArticleUseCase';

export class GetAllArticleDataUsingFieldUseCase implements IGetAllArticleDataUsingFieldUseCase {
  constructor(
        private articleRepository: IArticleRepository,
  ) { }

  async execute(field: Partial<Article>): Promise<Article[] | null> {
    const filterData = await this.articleRepository.findAllwithField({ ...field });

    return filterData ?? null;
  }
}

