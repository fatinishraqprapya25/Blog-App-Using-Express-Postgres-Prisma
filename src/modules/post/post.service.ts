import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "createdAt" | "updatedAt" | "id">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    });
    return result;
}

const getAllPosts = async () => {
    const result = await prisma.post.findMany();
    return result;
}

const getSinglePost = async (id: string) => {
    const result = await prisma.post.findUnique({
        where: {
            id
        }
    })
    return result;
}

export const postService = {
    createPost,
    getAllPosts,
    getSinglePost
}