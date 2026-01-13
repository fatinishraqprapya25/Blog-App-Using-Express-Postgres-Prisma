import "express";

declare module "express" {
    interface Request {
        body: unknown;
    }
}
