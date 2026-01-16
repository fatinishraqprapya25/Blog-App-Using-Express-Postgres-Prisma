import { Post, POST_STATUS } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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

const getAllPosts = async ({ search, tags, isFeatured, status, authorId, skip, limit, sortBy, sortOrder, page }: { search: string | undefined, tags: string[] | [], isFeatured: boolean | undefined, status: POST_STATUS | undefined, authorId: string | undefined, skip: number, limit: number, sortBy: string, sortOrder: string, page: number }) => {

    const andConditions: PostWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search as string,
                    }
                }
            ]
        });
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags
            }
        });
    }

    if (typeof isFeatured === "boolean") {
        andConditions.push({
            isFeatured
        });
    }

    if (status) {
        andConditions.push({
            status
        })
    }

    if (authorId) {
        andConditions.push({
            authorId
        });
    }

    const result = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.post.count({
        where: {
            AND: andConditions
        }
    });

    return {
        posts: result,
        pagination: {
            total,
            currentPage: page,
            totalPage: Math.ceil(total / limit),
            limit,


        }
    }
}

const getSinglePost = async (id: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id
            },
            data: {
                views: {
                    increment: 1
                }
            }
        });
        const postsData = await tx.post.findUnique({
            where: {
                id
            }
        });
        return postsData;
    });
}

export const postService = {
    createPost,
    getAllPosts,
    getSinglePost
}