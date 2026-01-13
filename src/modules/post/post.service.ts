import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "createdAt" | "updatedAt" | "id">) => {
    const result = await prisma.post.create({
        data
    });
    return result;
}

const getAllPosts = async () => { 
    
}

export const postService = {
    createPost
}