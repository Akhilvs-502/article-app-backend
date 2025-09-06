import { IArticleActionRepository } from "@/domain/repositories/IArticleRepository";
import { IGetFeedUseCase } from "../interfaces/IUserUseCase";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { FeedDTO, FeedMapper } from "../mapper/FeedMapper";





export class GetFeedUseCase implements IGetFeedUseCase {

    constructor(
        private userRepository: IUserRepository,
        private articleRepository: IArticleActionRepository
    ) { }

    async execute(userId: string): Promise<FeedDTO[]> {
        
        const userData = await this.userRepository.findById(userId);
        const feeds = await this.articleRepository.getUserFeeds(userId, userData?.preferences || []);

        console.log(feeds);
        

        return FeedMapper.toFeedDTO(feeds);
    }
}