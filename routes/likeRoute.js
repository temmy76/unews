import likeController from "../controllers/likeController";
import { Router } from "express";

const router = Router();

router.get("/", likeController.getAll);

export { router as default };
