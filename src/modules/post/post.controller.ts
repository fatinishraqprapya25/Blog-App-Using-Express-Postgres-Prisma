import { Request, Response } from "express";
import { postService } from "./post.service";
import { Post } from "../../../generated/prisma/client";

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postService.createPost(req.body as Omit<Post, "createdAt" | "updatedAt" | "id">, req?.user?.id!);
        return res.status(201).json({
            success: true,
            message: "Post Created!",
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: err
        });
    }
    res.send("Create New Post");
}

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === "string" ? search : undefined;
        const result = await postService.getAllPosts({ search: searchString });
        return res.status(200).json({
            success: true,
            message: "posts retrieved successfully!",
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve posts",
            error: err
        });
    }
}

const getSinglePost = async (req: Request, res: Response) => {
    try {
        const result = await postService.getSinglePost(req.params.id as string);
        return res.status(200).json({
            success: true,
            message: "post retrieved successfully!",
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve post",
            error: err
        });
    }
}

export const postController = {
    createPost,
    getAllPosts,
    getSinglePost
}