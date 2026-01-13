import express, { Application, Request } from "express";

const app: Application = express();

app.get("/", (req: Request, res) => {
    res.json({});
});

export default app;