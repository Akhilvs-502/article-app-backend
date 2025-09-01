

export class Article{
      constructor(
        public userId:string,
        public title:string,
        public description:string,
        public content:string,    
        public category:string,
        public tags:string[],
        public image:string,
        public _id?:string,
        public likes?: number,
        public dislikes?: number,
        public createdAt?: Date,
        public updatedAt?: Date,
        public isBlocked?:Boolean
  ){}

}