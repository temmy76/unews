import likeController from "../controllers/likeController";
import { Router } from "express";

const router = Router();

router.get("/", likeController.getAll);

router.get("/:id", likeController.getPostLike);

export { router as default };
