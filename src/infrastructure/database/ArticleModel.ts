import mongoose, { Document, Schema } from "mongoose";


export interface IArticle extends Document {
    _id: string
    userId: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    image: string;
    likes: number;
    dislikes: number;
    createdAt?: Date;
    updatedAt?: Date;
    isBlocked?: boolean;
}





const ArticleSchema = new Schema<IArticle>({
    userId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        required:true
    },
    image:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    isBlocked:{
        type:Boolean,
        default:false   
    }
},{timestamps:true})

export const ArticleModel=mongoose.model<IArticle>("Article",ArticleSchema)

