

export class CreateArticleDTO {
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    image: string;

    constructor(
        data:{title: string,
        description: string,
        content: string,
        category: string,
        tags: string[],
        image: string}
    ) {
        this.title = data.title;
        this.description = data.description;
        this.content = data.content;
        this.category = data.category;
        this.tags = data.tags;
        this.image = data.image;
    }
}   