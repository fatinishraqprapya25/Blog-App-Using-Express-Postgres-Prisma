import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";

const postRouter = express.Router();

export enum userRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: String,
                email: String,
                name: String,
                role: String,
                emailVerified: boolean
            }
        }
    }
}

const auth = (...roles: userRole[]) => async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
        headers: req.headers as any
    });

    if (!session) {
        return res.status(401).json({
            success: false,
            message: "You are not authorized!"
        });
    }

    if (!session.user.emailVerified) {
        return res.status(403).json({
            success: false,
            message: "Email verification required. Please verify your email!"
        });
    }

    req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified
    };
    console.log(session.user);

    // console.log(req.user.role);
    if (roles.length && !roles.includes(req.user?.role as userRole)) {
        return res.status(403).json({
            success: false,
            message: "Forbidden, You have don't have permission to access!"
        });
    }

    next();
}

postRouter.post("/", auth(userRole.USER), postController.createPost);
postRouter.get("/", postController.getAllPosts);

export default postRouter;