import express from "express";
import { postController } from "./post.controller";

const postRouter = express.Router();

postRouter.post("/", postController.createPost);
postRouter.get("/", postController.getAllPosts);

export default postRouter;