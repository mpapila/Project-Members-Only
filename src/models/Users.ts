import mongoose, { Schema, Document, Model } from "mongoose";
import { UsersType } from '../types'


const usersSchema: Schema<UsersType> = new Schema({
    username: { type: String, required: true, unique: true, },
    password: { type: String, required: true, minlength: 8 },
    email: { type: String, required: true, unique: true, },
    isAdmin: { type: Boolean, default: false },
},
    {
        timestamps: true
    })

const User: Model<UsersType> = mongoose.model<UsersType>("User", usersSchema);

export default User;