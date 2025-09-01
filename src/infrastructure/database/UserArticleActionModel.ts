import mongoose from "mongoose";



export interface UserArticleAction {
  userId: string;
  articleId: string;
  action: "like" | "dislike";
}


const UserArticleActionSchema = new mongoose.Schema<UserArticleAction>({
  userId: {
    type: String,
    required: true
  },
  articleId: {
    type: String,
    required: true
  },
  action: { type: String, enum: ["like", "dislike"], required: true },

});

export const UserArticleActionModel = mongoose.model<UserArticleAction>("UserArticleAction", UserArticleActionSchema);