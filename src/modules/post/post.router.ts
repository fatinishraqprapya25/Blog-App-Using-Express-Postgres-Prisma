import express from "express";
import { postController } from "./post.controller";
import auth, { userRole } from "../../middlewares/auth";

const postRouter = express.Router();

postRouter.post("/", auth(userRole.USER), postController.createPost);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:id", postController.getSinglePost);

export default postRouter;