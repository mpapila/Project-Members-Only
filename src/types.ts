export type UsersType = Document & {
    username: String,
    password: String,
    email: String,
    isAdmin: Boolean
}

export type PostsType = Document & {
    username: String,
    post: String
}

export type JwtPayload = {
    _id: string;
    username: string;
    password: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
