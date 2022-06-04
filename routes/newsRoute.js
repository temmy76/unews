import { Router } from "express";
import newsController from "../controllers/newsControllers";
import likeController from "../controllers/likeController";

const router = Router();

router.get("/", newsController.showPublished);

router.get("/unpublished", newsController.showUnpublished);

router.get("/feed/:id", newsController.refreshViews);

router.get("/search", newsController.search);

router.post("/post", newsController.uploadNews);

router.post("/", likeController.LikeNews);

router.delete("/:id", newsController.deleteNews);

router.put("/feed/:id", newsController.editNews);

router.put("/:id", newsController.refreshLike);

router.put("/publish/:id", newsController.publishNews);

router.put("/feed/comment/:id", newsController.addComment);

router.put("/feed/comment/:id/:comment_id", newsController.deleteComment);

router.put("/feed/comment/:id/edit/:comment_id", newsController.editComment);

export { router as default };
