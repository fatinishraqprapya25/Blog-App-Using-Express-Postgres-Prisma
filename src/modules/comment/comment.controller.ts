import { Request, Response } from "express"
import { commentService } from "./comment.service";
import { Prisma } from "../../../generated/prisma/client";

const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        (req.body as any).authorId = user?.id;
        const result = await commentService.createComment(req.body as Prisma.CommentCreateInput);
        res.status(201).json({
            success: true,
            message: "Comment created successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
}

export const commentController = {
    createComment
}