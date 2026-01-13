import { Request, Response } from "express";
import { postService } from "./post.service";
import { Post } from "../../../generated/prisma/client";

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postService.createPost(req.body as Omit<Post, "createdAt" | "updatedAt" | "id">);
        res.status(201).json({
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

export const postController = {
    createPost
}