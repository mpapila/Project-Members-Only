import mongoose, { Schema, Document, Model } from "mongoose";
import { PostsType } from '../types'


const PostsSchema: Schema<PostsType> = new Schema({
    // username: { type: Schema.Types.ObjectId, ref: "username", required: true },
    username: String,
    post: String
})

const Post: Model<PostsType> = mongoose.model<PostsType>("Post", PostsSchema)

export default Post;