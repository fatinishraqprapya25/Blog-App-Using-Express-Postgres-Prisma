import express from "express";

const postRouter = express.Router();

postRouter.post("/", (req, res) => {
    res.json({
        message: "Hello World!"
    });
});

export default postRouter;