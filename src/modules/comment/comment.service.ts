import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: Prisma.CommentCreateInput) => {
    return await prisma.comment.create({
        data: payload
    });
}

export const commentService = {
    createComment
}