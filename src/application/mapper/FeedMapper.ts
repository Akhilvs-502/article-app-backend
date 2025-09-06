import { Article } from '@/domain/entities/Article';

export interface FeedDTO {
    _id?: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    image: string;
    likes?: number;
    dislikes?: number;
    createdAt?: Date;
    updatedAt?: Date;
    isLiked?: boolean;
    isDisliked?: boolean;
    isBlockedUser?: boolean;

}

export class FeedMapper {
    static toFeedDTO(feeds:FeedDTO[]): FeedDTO[] {
        

        return  feeds.map(feed=>
            ( {
            _id: feed?._id ?? '',
            title: feed.title,
            description: feed.description,
            content: feed.content,
            category: feed.category,
            tags: feed.tags,
            image: feed.image,
            likes: feed.likes ?? 0,
            dislikes: feed.dislikes ?? 0,
            createdAt: feed.createdAt,
            updatedAt: feed.updatedAt,
            isLiked: feed.isLiked,
            isDisliked: feed.isDisliked,
            isBlockedUser: feed.isBlockedUser
        }));
    }
}
