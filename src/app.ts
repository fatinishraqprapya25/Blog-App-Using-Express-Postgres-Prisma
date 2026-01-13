import express, { Application, Request } from "express";
import postRouter from "./modules/post/post.router";

const app: Application = express();

app.use(express.json());

app.use("/posts", postRouter);

export default app;